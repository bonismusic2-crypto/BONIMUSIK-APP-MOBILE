import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';

@Controller('api/playlists')
export class PlaylistsController {
    constructor(private readonly playlistsService: PlaylistsService) { }

    @Get()
    async getAll(@Query('userId') userId?: string) {
        return this.playlistsService.getAllPlaylists(userId);
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.playlistsService.getPlaylistById(id);
    }

    @Post()
    async create(@Body() createDto: any) {
        return this.playlistsService.createPlaylist(createDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateDto: any) {
        return this.playlistsService.updatePlaylist(id, updateDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.playlistsService.deletePlaylist(id);
    }

    @Get(':id/items')
    async getItems(@Param('id') id: string) {
        return this.playlistsService.getPlaylistItems(id);
    }

    @Post(':id/items')
    async addItem(@Param('id') id: string, @Body() item: any) {
        return this.playlistsService.addItemToPlaylist(id, item);
    }

    @Delete('items/:itemId')
    async removeItem(@Param('itemId') itemId: string) {
        return this.playlistsService.removeItemFromPlaylist(itemId);
    }
}
