import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SubscriptionsService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE
        );
    }

    async getAllSubscriptions(status?: string) {
        let query = this.supabase
            .from('subscriptions')
            .select(`
                *,
                user:users(phone_number, full_name)
            `)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Flatten user data
        return data.map((sub) => ({
            ...sub,
            user: sub.user,
        }));
    }

    async getSubscriptionByUserId(userId: string) {
        try {
            const { data, error } = await this.supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) throw error;
            return data && data.length > 0 ? data[0] : null;
        } catch (error) {
            console.error('Error getting subscription:', error);
            throw error;
        }
    }

    async createSubscription(userId: string, plan: 'monthly' | 'annual' | 'yearly', transactionId: string) {
        // Map 'yearly' to 'annual' for database compatibility
        const dbPlan = plan === 'yearly' ? 'annual' : plan;
        const amount = dbPlan === 'monthly' ? 1000 : 12000;
        const startDate = new Date();
        const endDate = new Date();

        if (dbPlan === 'monthly') {
            endDate.setDate(endDate.getDate() + 30);
        } else {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const { data, error } = await this.supabase
            .from('subscriptions')
            .insert({
                user_id: userId,
                plan: dbPlan,
                status: 'active',
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                amount,
                cinetpay_transaction_id: transactionId,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async getPaymentHistory() {
        const { data, error } = await this.supabase
            .from('subscriptions')
            .select(`
                *,
                user:users(phone_number, full_name)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
}
