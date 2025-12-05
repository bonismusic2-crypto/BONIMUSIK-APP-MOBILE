import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';

// Store for verification codes (in production, use Redis)
const resetCodes = new Map<string, { code: string; expiresAt: number }>();

@Injectable()
export class AuthService {
    private supabase: SupabaseClient;

    constructor(private jwtService: JwtService) {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE
        );
    }

    getSupabaseClient() {
        return this.supabase;
    }

    async register(phoneNumber: string, password: string, fullName: string, email?: string) {
        try {
            const { data: existingUser } = await this.supabase
                .from('users')
                .select('id')
                .eq('phone_number', phoneNumber)
                .single();

            if (existingUser) {
                throw new BadRequestException('Phone number already registered');
            }

            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const { data: newUser, error } = await this.supabase
                .from('users')
                .insert({
                    phone_number: phoneNumber,
                    password_hash: passwordHash,
                    full_name: fullName,
                    email: email || null,
                })
                .select('id, phone_number, full_name, created_at')
                .single();

            if (error) {
                throw new BadRequestException(error.message);
            }

            const payload = {
                sub: newUser.id,
                phone_number: newUser.phone_number
            };
            const access_token = this.jwtService.sign(payload);

            return {
                access_token,
                user: {
                    id: newUser.id,
                    phone_number: newUser.phone_number,
                    full_name: newUser.full_name,
                }
            };
        } catch (error) {
            throw error;
        }
    }

    async login(phoneNumber: string, password: string) {
        const { data: user, error } = await this.supabase
            .from('users')
            .select('id, phone_number, password_hash, full_name')
            .eq('phone_number', phoneNumber)
            .single();

        if (error || !user) {
            throw new UnauthorizedException('Invalid phone number or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid phone number or password');
        }

        const payload = {
            sub: user.id,
            phone_number: user.phone_number
        };
        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                id: user.id,
                phone_number: user.phone_number,
                full_name: user.full_name,
            }
        };
    }

    /**
     * Generate a reset code and return it (On-Screen Display Flow)
     */
    async sendResetCode(phoneNumber: string) {
        try {
            // Check if user exists
            const { data: user } = await this.supabase
                .from('users')
                .select('id')
                .eq('phone_number', phoneNumber)
                .single();

            if (!user) {
                throw new BadRequestException('Phone number not found');
            }

            // Generate 6-digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // Store code with 10 minutes expiration
            resetCodes.set(phoneNumber, {
                code,
                expiresAt: Date.now() + 10 * 60 * 1000
            });

            console.log(`\n🔐 ====== RESET CODE ======`);
            console.log(`📞 Phone: ${phoneNumber}`);
            console.log(`🔑 Code: ${code}`);
            console.log(`⏰ Expires: ${new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString()}`);
            console.log(`===========================\n`);

            return {
                success: true,
                message: 'Code generated successfully',
                // Return code to frontend for display
                code: code
            };
        } catch (error) {
            console.error('Error generating reset code:', error);
            throw error;
        }
    }

    async verifyResetCode(phoneNumber: string, code: string) {
        const stored = resetCodes.get(phoneNumber);

        if (!stored) {
            throw new BadRequestException('No reset code found');
        }

        if (stored.expiresAt < Date.now()) {
            resetCodes.delete(phoneNumber);
            throw new BadRequestException('Code has expired');
        }

        if (stored.code !== code) {
            throw new BadRequestException('Invalid code');
        }

        return { success: true, message: 'Code verified' };
    }

    async resetPassword(phoneNumber: string, code: string, newPassword: string) {
        // Verify code first
        await this.verifyResetCode(phoneNumber, code);

        try {
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(newPassword, saltRounds);

            const { error } = await this.supabase
                .from('users')
                .update({ password_hash: passwordHash })
                .eq('phone_number', phoneNumber);

            if (error) {
                throw new BadRequestException('Could not reset password');
            }

            // Remove used code
            resetCodes.delete(phoneNumber);

            console.log(`✅ Password reset successfully for ${phoneNumber}`);

            return { success: true, message: 'Password reset successfully' };
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    }
}
