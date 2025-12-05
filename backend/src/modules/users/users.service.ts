import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UsersService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE
        );
    }

    async createUser(userData: any) {
        // Note: In a real app, you should hash the password here if not already hashed.
        // Assuming the controller or frontend sends a hashed password or we hash it here.
        // For now, let's assume we receive plain text and hash it (using bcrypt if available, or just storing as is for demo - wait, create_users_table says password_hash).
        // I'll import bcrypt.
        const bcrypt = require('bcrypt');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const { data, error } = await this.supabase
            .from('users')
            .insert([{
                phone_number: userData.phone_number,
                full_name: userData.full_name,
                password_hash: hashedPassword,
                role: userData.role || 'user'
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async getAllUsers() {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    async blockUser(userId: string) {
        const { error } = await this.supabase
            .from('users')
            .update({ is_blocked: true })
            .eq('id', userId);

        if (error) throw error;
        return { success: true, message: 'User blocked' };
    }

    async unblockUser(userId: string) {
        const { error } = await this.supabase
            .from('users')
            .update({ is_blocked: false })
            .eq('id', userId);

        if (error) throw error;
        return { success: true, message: 'User unblocked' };
    }
}
