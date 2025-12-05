import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
    imports: [UploadsModule],
    controllers: [VideosController],
    providers: [VideosService],
    exports: [VideosService],
})
export class VideosModule { }
