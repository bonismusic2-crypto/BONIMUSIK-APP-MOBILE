import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('api/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        return this.adminService.login(body.email, body.password);
    }
}
