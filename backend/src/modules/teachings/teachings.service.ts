import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class TeachingsService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE,
        );
    }

    async getAllTeachings(search?: string) {
        let query = this.supabase.from('teachings').select('*');
        if (search) {
            query = query.ilike('title', `%${search}%`);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }

    async getTeachingById(id: string) {
        const { data, error } = await this.supabase
            .from('teachings')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    async createTeaching(dto: any) {
        const { data, error } = await this.supabase.from('teachings').insert([dto]).select();
        if (error) throw error;
        return data ? data[0] : null;
    }

    async updateTeaching(id: string, dto: any) {
        const { data, error } = await this.supabase
            .from('teachings')
            .update(dto)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data;
    }

    async deleteTeaching(id: string) {
        const { data, error } = await this.supabase
            .from('teachings')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return { success: true };
    }
}
