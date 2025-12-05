import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Post()
    async create(@Body() body: any) {
        return this.usersService.createUser(body);
    }

    @Put(':id/block')
    async blockUser(@Param('id') id: string) {
        return this.usersService.blockUser(id);
    }

    @Put(':id/unblock')
    async unblockUser(@Param('id') id: string) {
        return this.usersService.unblockUser(id);
    }
}
