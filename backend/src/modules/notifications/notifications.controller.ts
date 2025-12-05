import { Controller, Post, Body, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    /**
     * Register FCM token for a user (called from mobile app)
     */
    @Post('register-token')
    async registerToken(@Body() body: { userId: string; token: string; platform: string }) {
        return this.notificationsService.registerToken(body.userId, body.token, body.platform);
    }

    /**
     * Send notification to a specific user (admin only)
     */
    @Post('send-to-user')
    async sendToUser(@Body() body: { userId: string; title: string; body: string; data?: any }) {
        return this.notificationsService.sendToUser(body.userId, body.title, body.body, body.data);
    }

    /**
     * Send notification to all users (admin only)
     */
    @Post('send-to-all')
    async sendToAll(@Body() body: { title: string; body: string; data?: any }) {
        return this.notificationsService.sendToAllUsers(body.title, body.body, body.data);
    }

    /**
     * Send notification to a topic (admin only)
     */
    @Post('send-to-topic')
    async sendToTopic(@Body() body: { topic: string; title: string; body: string; data?: any }) {
        return this.notificationsService.sendToTopic(body.topic, body.title, body.body, body.data);
    }

    /**
     * Test endpoint - Send a test notification to all users
     */
    @Get('test')
    async testNotification() {
        return this.notificationsService.sendToAllUsers(
            '🎉 Test BONI MUSIK',
            'Les notifications fonctionnent parfaitement !',
            { type: 'test' }
        );
    }

    /**
     * Legacy endpoint for backward compatibility
     */
    @Post('send')
    async sendNotification(@Body() body: { message: string }) {
        return this.notificationsService.sendPushNotification(body.message);
    }
}
