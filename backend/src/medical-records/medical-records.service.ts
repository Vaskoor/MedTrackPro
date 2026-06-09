import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class MedicalRecordsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.medicalRecord.findMany();
  }

  async findOne(id: string) {
    return this.prisma.medicalRecord.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.medicalRecord.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.medicalRecord.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.medicalRecord.delete({ where: { id } });
  }
}
