import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { LabOrdersService } from './lab-orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('lab-orders')
@UseGuards(JwtAuthGuard)
export class LabOrdersController {
  constructor(private readonly service: LabOrdersService) {}

  @Get()
  async findAll(@Request() req: any) {
    const patient = await this.service['prisma'].patient.findUnique({ where: { userId: req.user.id } });
    if (!patient) throw new Error('Patient not found');
    return this.service.findAll(patient.id);
  }

  @Post()
  async create(@Request() req: any, @Body('testName') testName: string) {
    const patient = await this.service['prisma'].patient.findUnique({ where: { userId: req.user.id } });
    const doctor = await this.service['prisma'].doctor.findFirst();
    if (!patient || !doctor) throw new Error('Patient or doctor not found');
    return this.service.create(patient.id, doctor.id, testName);
  }
}
