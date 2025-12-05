import { Controller, Get, Query } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('api')
export class ContentController {
    constructor(private readonly contentService: ContentService) { }

    @Get('albums')
    async getAlbums() {
        return this.contentService.getAllAlbums();
    }

    @Get('videos')
    async getVideos(@Query('category') category?: string) {
        return this.contentService.getAllVideos(category);
    }

    @Get('teachings')
    async getTeachings() {
        return this.contentService.getAllTeachings();
    }
}
