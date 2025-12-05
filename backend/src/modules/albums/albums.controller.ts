import { Controller, Get, Post, Put, Delete, Param, Body, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AlbumsService } from './albums.service';
import { UploadsService } from '../uploads/uploads.service';

@Controller('api/albums')
export class AlbumsController {
    constructor(
        private readonly albumsService: AlbumsService,
        private readonly uploadsService: UploadsService,
    ) { }

    @Get()
    async getAll(@Query('search') search?: string) {
        return this.albumsService.getAllAlbums(search);
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.albumsService.getAlbumById(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body() createDto: any, @UploadedFile() file: Express.Multer.File) {
        try {
            console.log('Creating album with data:', createDto);
            console.log('File received:', file ? file.originalname : 'No file');

            if (file) {
                console.log('Uploading file to Supabase...');
                const sanitizedFilename = file.originalname
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-zA-Z0-9.]/g, '_');

                const fileUrl = await this.uploadsService.uploadFile('covers', `albums/${Date.now()}_${sanitizedFilename}`, file);
                console.log('File uploaded successfully:', fileUrl);
                createDto.cover_url = fileUrl;
            }

            console.log('Creating album in database...');
            const result = await this.albumsService.createAlbum(createDto);
            console.log('Album created successfully:', result);
            return result;
        } catch (error) {
            console.error('Error creating album:', error);
            throw error;
        }
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    async update(@Param('id') id: string, @Body() updateDto: any, @UploadedFile() file: Express.Multer.File) {
        if (file) {
            const sanitizedFilename = file.originalname
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9.]/g, '_');
            const fileUrl = await this.uploadsService.uploadFile('covers', `albums/${Date.now()}_${sanitizedFilename}`, file);
            updateDto.cover_url = fileUrl;
        }
        return this.albumsService.updateAlbum(id, updateDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.albumsService.deleteAlbum(id);
    }

    @Post(':id/tracks')
    @UseInterceptors(FileInterceptor('file'))
    async addTrack(
        @Param('id') albumId: string,
        @Body() trackDto: any,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.albumsService.addTrack(albumId, trackDto, file);
    }

    @Delete('tracks/:trackId')
    async deleteTrack(@Param('trackId') trackId: string) {
        return this.albumsService.deleteTrack(trackId);
    }
}
