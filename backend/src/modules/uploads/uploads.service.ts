import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UploadsService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE,
        );
    }

    /**
     * Upload a file buffer to Supabase Storage.
     * @param bucket The storage bucket name.
     * @param path The full path inside the bucket (e.g. "albums/cover.jpg").
     * @param file The Multer file object.
     */
    async uploadFile(bucket: string, path: string, file: Express.Multer.File) {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucket)
                .upload(path, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true,
                });
            if (error) throw error;

            const { data: publicUrlData } = this.supabase.storage.from(bucket).getPublicUrl(path);
            return publicUrlData.publicUrl;
        } catch (error) {
            console.error('Supabase Upload Error:', error);
            if (error && (error as any).cause) {
                console.error('Error Cause:', (error as any).cause);
            }
            throw error;
        }
    }
}
