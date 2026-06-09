import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.patient.findMany(); }
  async findOne(id: string) { return this.prisma.patient.findUnique({ where: { id } }); }
  async create(data: any) { return this.prisma.patient.create({ data }); }
  async update(id: string, data: any) { return this.prisma.patient.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.patient.delete({ where: { id } }); }
}
