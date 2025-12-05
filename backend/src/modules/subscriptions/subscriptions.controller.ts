import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller('api/subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    @Get()
    async getAllSubscriptions(@Query('status') status?: string) {
        return this.subscriptionsService.getAllSubscriptions(status);
    }

    @Get(':userId')
    async getSubscriptionByUserId(@Param('userId') userId: string) {
        return this.subscriptionsService.getSubscriptionByUserId(userId);
    }

    @Get('payments/history')
    async getPaymentHistory() {
        return this.subscriptionsService.getPaymentHistory();
    }
}
