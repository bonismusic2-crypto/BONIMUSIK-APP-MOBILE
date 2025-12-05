import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class VideosService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE,
        );
    }

    async getAllVideos(search?: string) {
        let query = this.supabase.from('videos').select('*');
        if (search) {
            query = query.ilike('title', `%${search}%`);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }

    async getVideoById(id: string) {
        const { data, error } = await this.supabase
            .from('videos')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    async createVideo(dto: any) {
        const { data, error } = await this.supabase.from('videos').insert([dto]).select();
        if (error) throw error;
        return data ? data[0] : null;
    }

    async updateVideo(id: string, dto: any) {
        const { data, error } = await this.supabase
            .from('videos')
            .update(dto)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data;
    }

    async deleteVideo(id: string) {
        const { data, error } = await this.supabase
            .from('videos')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return { success: true };
    }
}
