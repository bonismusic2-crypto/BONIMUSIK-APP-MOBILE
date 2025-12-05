import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: any) {
        const { phoneNumber, password } = body;
        if (!phoneNumber || !password) {
            throw new BadRequestException('Phone number and password are required');
        }
        return this.authService.login(phoneNumber, password);
    }

    @Post('register')
    async register(@Body() body: any) {
        const { phoneNumber, password, fullName, email } = body;
        if (!phoneNumber || !password || !fullName) {
            throw new BadRequestException('Phone number, full name and password are required');
        }
        return this.authService.register(phoneNumber, password, fullName, email);
    }

    @Post('send-reset-code')
    async sendResetCode(@Body() body: { phoneNumber: string }) {
        if (!body.phoneNumber) {
            throw new BadRequestException('Phone number is required');
        }
        return this.authService.sendResetCode(body.phoneNumber);
    }

    @Post('verify-reset-code')
    async verifyResetCode(@Body() body: { phoneNumber: string; code: string }) {
        if (!body.phoneNumber || !body.code) {
            throw new BadRequestException('Phone number and code are required');
        }
        return this.authService.verifyResetCode(body.phoneNumber, body.code);
    }

    @Post('reset-password')
    async resetPassword(@Body() body: { phoneNumber: string; code: string; newPassword: string }) {
        if (!body.phoneNumber || !body.code || !body.newPassword) {
            throw new BadRequestException('Phone number, code and new password are required');
        }
        return this.authService.resetPassword(body.phoneNumber, body.code, body.newPassword);
    }
}
