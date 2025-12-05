import { Controller, Get, Post, Put, Delete, Param, Body, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { UploadsService } from '../uploads/uploads.service';

@Controller('api/videos')
export class VideosController {
    constructor(
        private readonly videosService: VideosService,
        private readonly uploadsService: UploadsService,
    ) { }

    @Get()
    async getAll(@Query('search') search?: string) {
        return this.videosService.getAllVideos(search);
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.videosService.getVideoById(id);
    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
    ]))
    async create(@Body() createDto: any, @UploadedFiles() files: { video?: Express.Multer.File[], thumbnail?: Express.Multer.File[] }) {
        if (files.video) {
            const videoUrl = await this.uploadsService.uploadFile('videos', `videos/${Date.now()}_${files.video[0].originalname}`, files.video[0]);
            createDto.url = videoUrl;
        }
        if (files.thumbnail) {
            const thumbUrl = await this.uploadsService.uploadFile('covers', `thumbnails/${Date.now()}_${files.thumbnail[0].originalname}`, files.thumbnail[0]);
            createDto.thumbnail_url = thumbUrl;
        }
        return this.videosService.createVideo(createDto);
    }

    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
    ]))
    async update(@Param('id') id: string, @Body() updateDto: any, @UploadedFiles() files: { video?: Express.Multer.File[], thumbnail?: Express.Multer.File[] }) {
        if (files.video) {
            const videoUrl = await this.uploadsService.uploadFile('videos', `videos/${Date.now()}_${files.video[0].originalname}`, files.video[0]);
            updateDto.url = videoUrl;
        }
        if (files.thumbnail) {
            const thumbUrl = await this.uploadsService.uploadFile('covers', `thumbnails/${Date.now()}_${files.thumbnail[0].originalname}`, files.thumbnail[0]);
            updateDto.thumbnail_url = thumbUrl;
        }
        return this.videosService.updateVideo(id, updateDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.videosService.deleteVideo(id);
    }
}
