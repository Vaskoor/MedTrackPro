import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class LabOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(patientId: string) {
    return this.prisma.labOrder.findMany({ where: { patientId } });
  }

  async create(patientId: string, doctorId: string, testName: string) {
    return this.prisma.labOrder.create({
      data: { patientId, doctorId, testName, status: 'REQUESTED' },
    });
  }
}
