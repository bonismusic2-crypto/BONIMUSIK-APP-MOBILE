import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
    imports: [UploadsModule],
    controllers: [AlbumsController],
    providers: [AlbumsService],
    exports: [AlbumsService],
})
export class AlbumsModule { }
