import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as admin from 'firebase-admin';
import { join } from 'path';

@Injectable()
export class NotificationsService implements OnModuleInit {
    private supabase: SupabaseClient;
    private firebaseApp: admin.app.App;
    private firebaseInitialized = false;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE
        );
    }

    onModuleInit() {
        try {
            // Initialize Firebase Admin SDK
            const serviceAccountPath = join(process.cwd(), 'firebase-admin-key.json');

            this.firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccountPath),
            });

            this.firebaseInitialized = true;
            console.log('✅ Firebase Admin SDK initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Firebase Admin SDK:', error.message);
            console.log('⚠️  Make sure firebase-admin-key.json exists in the backend root directory');
            console.log('📝 Push notifications will not work until Firebase is configured');
        }
    }

    /**
     * Register FCM token for a user
     */
    async registerToken(userId: string, token: string, platform: string) {
        try {
            const { error } = await this.supabase
                .from('users')
                .update({ fcm_token: token, device_platform: platform })
                .eq('id', userId);

            if (error) throw error;

            console.log(`✅ FCM token registered for user ${userId}`);
            return { success: true };
        } catch (error) {
            console.error('Error registering FCM token:', error);
            throw error;
        }
    }

    /**
     * Send push notification to a single user
     */
    async sendToUser(userId: string, title: string, body: string, data?: any) {
        if (!this.firebaseInitialized) {
            console.log('⚠️  Firebase not initialized, skipping notification');
            return { success: false, error: 'Firebase not initialized' };
        }

        try {
            // Get user's FCM token
            const { data: user } = await this.supabase
                .from('users')
                .select('fcm_token')
                .eq('id', userId)
                .single();

            if (!user || !user.fcm_token) {
                console.log(`⚠️  No FCM token found for user ${userId}`);
                return { success: false, error: 'No FCM token' };
            }

            const message: admin.messaging.Message = {
                notification: {
                    title,
                    body,
                },
                data: data || {},
                token: user.fcm_token,
            };

            const response = await admin.messaging().send(message);
            console.log(`✅ Notification sent to user ${userId}:`, response);
            return { success: true, messageId: response };
        } catch (error) {
            console.error('Error sending notification to user:', error);
            throw error;
        }
    }

    /**
     * Send push notification to all users
     */
    async sendToAllUsers(title: string, body: string, data?: any) {
        if (!this.firebaseInitialized) {
            console.log('⚠️  Firebase not initialized, skipping notification');
            return { success: false, error: 'Firebase not initialized' };
        }

        try {
            // Get all users with FCM tokens
            const { data: users } = await this.supabase
                .from('users')
                .select('fcm_token')
                .not('fcm_token', 'is', null);

            if (!users || users.length === 0) {
                return { success: true, sent: 0, message: 'No users with FCM tokens' };
            }

            const tokens = users.map(u => u.fcm_token);
            const message: admin.messaging.MulticastMessage = {
                notification: {
                    title,
                    body,
                },
                data: data || {},
                tokens,
            };

            const response = await admin.messaging().sendEachForMulticast(message);
            console.log(`✅ Sent ${response.successCount}/${tokens.length} notifications`);

            if (response.failureCount > 0) {
                console.log(`⚠️  Failed to send ${response.failureCount} notifications`);
            }

            return {
                success: true,
                successCount: response.successCount,
                failureCount: response.failureCount,
                total: tokens.length,
            };
        } catch (error) {
            console.error('Error sending notifications to all users:', error);
            throw error;
        }
    }

    /**
     * Send notification to a topic (e.g., "new_content", "live_starting")
     */
    async sendToTopic(topic: string, title: string, body: string, data?: any) {
        if (!this.firebaseInitialized) {
            console.log('⚠️  Firebase not initialized, skipping notification');
            return { success: false, error: 'Firebase not initialized' };
        }

        try {
            const message: admin.messaging.Message = {
                notification: {
                    title,
                    body,
                },
                data: data || {},
                topic,
            };

            const response = await admin.messaging().send(message);
            console.log(`✅ Notification sent to topic "${topic}":`, response);
            return { success: true, messageId: response };
        } catch (error) {
            console.error('Error sending notification to topic:', error);
            throw error;
        }
    }

    /**
     * Legacy method for backward compatibility
     */
    async sendPushNotification(message: string) {
        return this.sendToAllUsers('BONI MUSIK', message);
    }
}
