import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ContentModule } from './modules/content/content.module';
import { AdminModule } from './modules/admin/admin.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { LivesModule } from './modules/lives/lives.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { VideosModule } from './modules/videos/videos.module';
import { TeachingsModule } from './modules/teachings/teachings.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    AdminModule,
    UsersModule,
    SubscriptionsModule,
    PaymentsModule,
    ContentModule,
    AnalyticsModule,
    LivesModule,
    NotificationsModule,
    UploadsModule,
    AlbumsModule,
    VideosModule,
    TeachingsModule,
    PlaylistsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
