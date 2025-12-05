import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class AlbumsService {
    private supabase: SupabaseClient;

    constructor(private readonly uploadsService: UploadsService) {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE,
        );
    }

    async getAllAlbums(search?: string) {
        let query = this.supabase.from('albums').select('*');
        if (search) {
            query = query.ilike('title', `%${search}%`);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }

    async getAlbumById(id: string) {
        // Fetch album data
        const { data: album, error: albumError } = await this.supabase
            .from('albums')
            .select('*')
            .eq('id', id)
            .single();
        if (albumError) throw albumError;
        // Fetch associated tracks
        const { data: tracks, error: tracksError } = await this.supabase
            .from('tracks')
            .select('*')
            .eq('album_id', id);
        if (tracksError) throw tracksError;
        return { ...album, tracks };
    }

    async createAlbum(dto: any) {
        const { data, error } = await this.supabase.from('albums').insert([dto]).select();
        if (error) throw error;
        return data ? data[0] : null;
    }

    async updateAlbum(id: string, dto: any) {
        const { data, error } = await this.supabase
            .from('albums')
            .update(dto)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data;
    }

    async deleteAlbum(id: string) {
        const { data, error } = await this.supabase
            .from('albums')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return { success: true };
    }

    async addTrack(albumId: string, trackDto: any, file: Express.Multer.File) {
        // Sanitize filename: remove special chars, spaces, and ensure ASCII only
        const sanitizedFilename = file.originalname
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-zA-Z0-9.]/g, '_'); // Replace non-alphanumeric chars with underscore

        // Upload track file
        const fileUrl = await this.uploadsService.uploadFile('tracks', `albums/${albumId}/${Date.now()}_${sanitizedFilename}`, file);
        const trackData = {
            album_id: albumId,
            title: trackDto.title,
            duration: trackDto.duration,
            file_url: fileUrl,
            track_number: trackDto.track_number,
        };
        const { data, error } = await this.supabase.from('tracks').insert([trackData]).select();
        if (error) throw error;
        return data ? data[0] : null;
    }

    async deleteTrack(trackId: string) {
        const { data, error } = await this.supabase.from('tracks').delete().eq('id', trackId);
        if (error) throw error;
        return { success: true };
    }
}
