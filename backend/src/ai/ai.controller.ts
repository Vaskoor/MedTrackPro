import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly service: AiService) {}

  @Get('insights')
  async getInsights(@Request() req: any) {
    const patient = await this.service['prisma'].patient.findUnique({ where: { userId: req.user.id } });
    if (!patient) throw new Error('Patient not found');
    return this.service.getInsights(patient.id);
  }
}
