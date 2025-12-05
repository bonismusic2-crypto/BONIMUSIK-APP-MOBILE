import { Module } from '@nestjs/common';
import { TeachingsController } from './teachings.controller';
import { TeachingsService } from './teachings.service';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
    imports: [UploadsModule],
    controllers: [TeachingsController],
    providers: [TeachingsService],
    exports: [TeachingsService],
})
export class TeachingsModule { }
