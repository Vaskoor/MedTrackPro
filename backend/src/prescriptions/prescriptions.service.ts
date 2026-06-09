import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return this.prisma.prescription.findMany({
      include: {
        doctor: { include: { user: true } },
        medicines: true,
      },
  });
}
  async findOne(id: string) { return this.prisma.prescription.findUnique({ where: { id } }); }
  async create(data: any) { return this.prisma.prescription.create({ data }); }
  async update(id: string, data: any) { return this.prisma.prescription.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.prescription.delete({ where: { id } }); }
  // backend/src/prescriptions/prescriptions.service.ts
}

