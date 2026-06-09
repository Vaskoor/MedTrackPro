import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { VideoGateway } from './video.gateway';

@Module({
  controllers: [VideoController],
  providers: [VideoService, VideoGateway],
})
export class VideoModule {}
