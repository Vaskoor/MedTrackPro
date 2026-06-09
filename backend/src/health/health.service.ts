import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.healthLog.findMany(); }
  async findOne(id: string) { return this.prisma.healthLog.findUnique({ where: { id } }); }
  async create(data: any) { return this.prisma.healthLog.create({ data }); }
  async update(id: string, data: any) { return this.prisma.healthLog.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.healthLog.delete({ where: { id } }); }
}
