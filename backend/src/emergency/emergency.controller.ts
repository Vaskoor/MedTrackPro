import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('emergency')
@UseGuards(JwtAuthGuard)
export class EmergencyController {
  constructor(private readonly service: EmergencyService) {}

  @Post('sos')
  sendSOS(@Request() req: any, @Body('location') location: string) {
    return this.service.sendSOS(req.user.id, location);
  }
}
