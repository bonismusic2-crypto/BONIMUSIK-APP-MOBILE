import { Injectable } from '@nestjs/common';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { FedaPay, Transaction } from 'fedapay';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class PaymentsService {
    private supabase: SupabaseClient;

    constructor(private subscriptionsService: SubscriptionsService) {
        // Initialize FedaPay
        FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
        FedaPay.setEnvironment('live'); // Production mode

        // Initialize Supabase Admin Client
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE
        );
    }

    async createIntent(userId: string, amount: number, plan: string, phoneNumber?: string) {
        console.log(`Creating payment intent for user ${userId}, amount ${amount}, plan ${plan}`);
        try {
            const { data, error } = await this.supabase
                .from('payment_intents')
                .insert({
                    user_id: userId,
                    amount,
                    plan,
                    phone_number: phoneNumber,
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;
            return { success: true, intentId: data.id };
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    }

    async matchSmsPayment(data: { amount: number, transactionRef: string, phoneNumber?: string, rawSms?: string }) {
        console.log('Attempting to match SMS payment:', JSON.stringify(data));
        const { amount, transactionRef, phoneNumber, rawSms } = data;

        try {
            // Logic: Find pending intent with SAME amount created in the LAST 15 MINUTES
            // If phoneNumber is provided, we can prioritise matching that specific user.

            let query = this.supabase
                .from('payment_intents')
                .select('*')
                .eq('status', 'pending')
                .eq('amount', amount)
                .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // Last 15 mins
                .order('created_at', { ascending: false });

            // If we have a phone number, try to filter by it (fuzzy match could be added later if formats differ)
            // For now, let's just get the candidates and filter in code or trust the time window + amount 
            // since phone number format might vary (07... vs +225...)

            const { data: candidates, error } = await query;

            if (error) {
                console.error('Error fetching intents:', error);
                throw error;
            }

            if (!candidates || candidates.length === 0) {
                console.log('No matching intent found');
                return { success: false, message: 'No matching intent found' };
            }

            // Simple Strategy: Take the most recent one. 
            // Ideally, we check phone number match if available.
            let matchedIntent = candidates[0];

            if (phoneNumber) {
                // Try to find exact phone match if possible
                const exactMatch = candidates.find(c => c.phone_number && phoneNumber.includes(c.phone_number));
                if (exactMatch) {
                    matchedIntent = exactMatch;
                }
            }

            console.log(`MATCHED! Intent ID: ${matchedIntent.id} for User: ${matchedIntent.user_id}`);

            // 1. Mark intent as Matched
            await this.supabase
                .from('payment_intents')
                .update({
                    status: 'matched',
                    transaction_ref: transactionRef,
                    matched_at: new Date().toISOString()
                })
                .eq('id', matchedIntent.id);

            // 2. Activate Subscription
            await this.subscriptionsService.createSubscription(
                matchedIntent.user_id,
                matchedIntent.plan,
                transactionRef // Use SMS ID as transaction ID
            );

            return { success: true, userId: matchedIntent.user_id, plan: matchedIntent.plan };

        } catch (error) {
            console.error('Error matching SMS payment:', error);
            return { success: false, error: 'Internal server error during matching' };
        }
    }

    async approveManualPayment(intentId: string) {
        console.log(`Manual approval for intent ` + intentId);
        try {
            // 1. Fetch intent
            const { data: intent, error: fetchError } = await this.supabase
                .from('payment_intents')
                .select('*')
                .eq('id', intentId)
                .single();

            if (fetchError || !intent) throw new Error('Intent not found');
            if (intent.status !== 'pending') throw new Error('Intent is not pending');

            // 2. Update Intent
            await this.supabase
                .from('payment_intents')
                .update({
                    status: 'approved_manual',
                    matched_at: new Date().toISOString()
                })
                .eq('id', intentId);

            // 3. Activate Subscription
            await this.subscriptionsService.createSubscription(
                intent.user_id,
                intent.plan,
                `MANUAL-${intentId}`
            );

            return { success: true };
        } catch (error) {
            console.error('Error manual approval:', error);
            throw error;
        }
    }



    async getPaymentIntents(status?: string) {
        let query = this.supabase
            .from('payment_intents')
            .select(`
                *,
                user:users(full_name, phone_number)
            `)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    // --- Legacy FedaPay Methods (Kept for compatibility) ---

    async createTransaction(amount: number, description: string, userId: string, plan: string, returnUrl?: string) {
        try {
            // Append returnUrl to callback_url if provided
            let callbackUrl = 'https://bonimusik-app-mobile.onrender.com/api/payments/callback';
            if (returnUrl) {
                callbackUrl += `?returnUrl=${encodeURIComponent(returnUrl)}`;
            }

            const transaction = await Transaction.create({
                description,
                amount,
                currency: {
                    iso: 'XOF'
                },
                callback_url: callbackUrl,
                // mode: 'mtn', // Removed to allow all methods
                customer: {
                    email: 'customer@example.com', // Should come from user
                    lastname: 'Doe', // Should come from user
                    firstname: 'John', // Should come from user
                },
                custom_metadata: {
                    user_id: userId,  // Use snake_case for FedaPay
                    plan
                }
            });

            const token = await transaction.generateToken();
            return { url: token.url, token: token.token };
        } catch (error) {
            console.error('Error creating FedaPay transaction:', error);
            throw error;
        }
    }

    async verifyTransaction(transactionId: number) {
        try {
            const transaction = await Transaction.retrieve(transactionId);
            return transaction;
        } catch (error) {
            console.error('Error verifying transaction:', error);
            throw error;
        }
    }

    async processSuccessfulPayment(transactionId: number) {
        try {
            const transaction = await this.verifyTransaction(transactionId);

            console.log('Transaction retrieved:', JSON.stringify(transaction, null, 2));

            if (transaction.status === 'approved') {
                // FedaPay stores custom_metadata with snake_case keys
                const userId = transaction.custom_metadata?.user_id;
                const plan = transaction.custom_metadata?.plan;

                if (!userId || !plan) {
                    console.error('Missing userId or plan in custom_metadata:', transaction.custom_metadata);
                    return false;
                }

                console.log(`✅ Processing successful payment for user ${userId}, plan ${plan}`);
                await this.subscriptionsService.createSubscription(userId, plan, transaction.id.toString());
                console.log(`✅ Subscription created successfully!`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error processing successful payment:', error);
            return false;
        }
    }

    async handleWebhook(payload: any, signature: string) {
        // Verify signature if possible, or check status
        // FedaPay sends the transaction object in the payload
        console.log('FedaPay webhook received:', payload);

        const { id, status, custom_metadata } = payload.entity;

        if (status === 'approved') {
            const userId = custom_metadata?.user_id;
            const plan = custom_metadata?.plan;

            if (!userId || !plan) {
                console.error('Missing userId or plan in webhook custom_metadata:', custom_metadata);
                return { success: false, message: 'Missing metadata' };
            }

            console.log(`Payment approved for user ${userId}, plan ${plan}`);
            await this.subscriptionsService.createSubscription(userId, plan, id.toString());
            return { success: true };
        }

        return { success: false, message: 'Transaction not approved' };
    }
}
