import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class LivesService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE
        );
    }

    async getLiveLinks() {
        const { data, error } = await this.supabase
            .from('live_links')
            .select('*');

        if (error) throw error;
        return data || [];
    }

    async updateLiveLinks(tiktok: any, facebook: any) {
        // Update or insert TikTok link
        const { error: tiktokError } = await this.supabase
            .from('live_links')
            .upsert({
                platform: 'tiktok',
                url: tiktok.url,
                is_active: tiktok.is_active,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'platform' });

        if (tiktokError) throw tiktokError;

        // Update or insert Facebook link
        const { error: facebookError } = await this.supabase
            .from('live_links')
            .upsert({
                platform: 'facebook',
                url: facebook.url,
                is_active: facebook.is_active,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'platform' });

        if (facebookError) throw facebookError;

        return { success: true };
    }
}
