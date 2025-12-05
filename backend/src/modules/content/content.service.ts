import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ContentService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE
        );
    }

    // Albums
    async getAllAlbums() {
        const { data, error } = await this.supabase
            .from('albums')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    // Videos
    async getAllVideos(category?: string) {
        let query = this.supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    // Teachings
    async getAllTeachings() {
        const { data, error } = await this.supabase
            .from('teachings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
}
