import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    private supabase: SupabaseClient;

    constructor(private jwtService: JwtService) {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE
        );
    }

    async login(email: string, password: string) {
        // Find admin by email
        const { data: admin, error } = await this.supabase
            .from('admins')
            .select('id, email, password_hash, full_name')
            .eq('email', email)
            .single();

        if (error || !admin) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Generate JWT token
        const payload = {
            sub: admin.id,
            email: admin.email,
            role: 'admin'
        };
        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            admin: {
                id: admin.id,
                email: admin.email,
                full_name: admin.full_name,
            }
        };
    }
}
