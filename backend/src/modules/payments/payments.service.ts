import { Injectable } from '@nestjs/common';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { FedaPay, Transaction } from 'fedapay';

@Injectable()
export class PaymentsService {
    constructor(private subscriptionsService: SubscriptionsService) {
        // Initialize FedaPay
        FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
        FedaPay.setEnvironment('live'); // Production mode
    }

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
