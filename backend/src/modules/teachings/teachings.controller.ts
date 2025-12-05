import { Controller, Get, Post, Put, Delete, Param, Body, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { TeachingsService } from './teachings.service';
import { UploadsService } from '../uploads/uploads.service';

@Controller('api/teachings')
export class TeachingsController {
    constructor(
        private readonly teachingsService: TeachingsService,
        private readonly uploadsService: UploadsService,
    ) { }

    @Get()
    async getAll(@Query('search') search?: string) {
        return this.teachingsService.getAllTeachings(search);
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.teachingsService.getTeachingById(id);
    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
    ]))
    async create(@Body() createDto: any, @UploadedFiles() files: { file?: Express.Multer.File[], thumbnail?: Express.Multer.File[] }) {
        if (files.file) {
            const fileUrl = await this.uploadsService.uploadFile('teachings', `teachings/${Date.now()}_${files.file[0].originalname}`, files.file[0]);
            createDto.file_url = fileUrl;
        }
        if (files.thumbnail) {
            const thumbUrl = await this.uploadsService.uploadFile('covers', `teachings/thumbnails/${Date.now()}_${files.thumbnail[0].originalname}`, files.thumbnail[0]);
            createDto.thumbnail_url = thumbUrl;
        }
        return this.teachingsService.createTeaching(createDto);
    }

    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
    ]))
    async update(@Param('id') id: string, @Body() updateDto: any, @UploadedFiles() files: { file?: Express.Multer.File[], thumbnail?: Express.Multer.File[] }) {
        if (files.file) {
            const fileUrl = await this.uploadsService.uploadFile('teachings', `teachings/${Date.now()}_${files.file[0].originalname}`, files.file[0]);
            updateDto.file_url = fileUrl;
        }
        if (files.thumbnail) {
            const thumbUrl = await this.uploadsService.uploadFile('covers', `teachings/thumbnails/${Date.now()}_${files.thumbnail[0].originalname}`, files.thumbnail[0]);
            updateDto.thumbnail_url = thumbUrl;
        }
        return this.teachingsService.updateTeaching(id, updateDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.teachingsService.deleteTeaching(id);
    }
}
