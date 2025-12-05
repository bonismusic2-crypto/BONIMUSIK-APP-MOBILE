import { Controller, Get, Put, Body } from '@nestjs/common';
import { LivesService } from './lives.service';

@Controller('api/lives')
export class LivesController {
    constructor(private readonly livesService: LivesService) { }

    @Get()
    async getLiveLinks() {
        return this.livesService.getLiveLinks();
    }

    @Put()
    async updateLiveLinks(@Body() body: { tiktok: any; facebook: any }) {
        return this.livesService.updateLiveLinks(body.tiktok, body.facebook);
    }
}
