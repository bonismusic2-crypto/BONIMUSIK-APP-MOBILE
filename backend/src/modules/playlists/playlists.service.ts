import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class PlaylistsService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE,
        );
    }

    async getAllPlaylists(userId?: string) {
        let query = this.supabase.from('playlists').select('*');

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }

    async getPlaylistById(id: string) {
        const { data, error } = await this.supabase
            .from('playlists')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    async createPlaylist(createDto: any) {
        const { data, error } = await this.supabase
            .from('playlists')
            .insert(createDto)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async updatePlaylist(id: string, updateDto: any) {
        const { data, error } = await this.supabase
            .from('playlists')
            .update(updateDto)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async deletePlaylist(id: string) {
        const { error } = await this.supabase
            .from('playlists')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return { message: 'Playlist deleted successfully' };
    }

    async getPlaylistItems(playlistId: string) {
        const { data, error } = await this.supabase
            .from('playlist_items')
            .select('*')
            .eq('playlist_id', playlistId)
            .order('position', { ascending: true });
        if (error) throw error;
        return data;
    }

    async addItemToPlaylist(playlistId: string, item: any) {
        const { data, error } = await this.supabase
            .from('playlist_items')
            .insert({
                playlist_id: playlistId,
                content_type: item.content_type,
                content_id: item.content_id,
                position: item.position || 0
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async removeItemFromPlaylist(itemId: string) {
        const { error } = await this.supabase
            .from('playlist_items')
            .delete()
            .eq('id', itemId);
        if (error) throw error;
        return { message: 'Item removed from playlist' };
    }
}
