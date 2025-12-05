import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AnalyticsService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE
        );
    }

    async getOverview() {
        // Get total subscribers
        const { count: totalSubscribers } = await this.supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        // Get active subscriptions
        const { count: activeSubscriptions } = await this.supabase
            .from('subscriptions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');

        // Get revenue data
        const { data: subscriptions } = await this.supabase
            .from('subscriptions')
            .select('amount, plan, created_at');

        // Calculate revenues
        const monthlyRevenue = subscriptions
            ?.filter(s => s.plan === 'monthly')
            .reduce((sum, s) => sum + s.amount, 0) || 0;

        const annualRevenue = subscriptions
            ?.filter(s => s.plan === 'annual')
            .reduce((sum, s) => sum + s.amount, 0) || 0;

        // New users this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: newUsersThisMonth } = await this.supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfMonth.toISOString());

        // Revenue data for last 12 months
        const revenueData = this.generateRevenueData(subscriptions || []);

        // Plan distribution
        const planDistribution = [
            { name: 'Mensuel', value: subscriptions?.filter(s => s.plan === 'monthly').length || 0 },
            { name: 'Annuel', value: subscriptions?.filter(s => s.plan === 'annual').length || 0 },
        ];

        // User growth data
        const userGrowth = await this.generateUserGrowthData();

        return {
            stats: {
                totalSubscribers: totalSubscribers || 0,
                activeSubscriptions: activeSubscriptions || 0,
                monthlyRevenue,
                annualRevenue,
                newUsersThisMonth: newUsersThisMonth || 0,
            },
            revenueData,
            planDistribution,
            userGrowth,
        };
    }

    private generateRevenueData(subscriptions: any[]) {
        const months = [];
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });

            const revenue = subscriptions
                .filter(s => {
                    const subDate = new Date(s.created_at);
                    return subDate.getMonth() === date.getMonth() &&
                        subDate.getFullYear() === date.getFullYear();
                })
                .reduce((sum, s) => sum + s.amount, 0);

            months.push({ month: monthName, revenue });
        }

        return months;
    }

    private async generateUserGrowthData() {
        const months = [];
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });

            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const { count } = await this.supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .lte('created_at', endOfMonth.toISOString());

            months.push({ month: monthName, users: count || 0 });
        }

        return months;
    }
}
