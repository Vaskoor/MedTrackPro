import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.auditLog.findMany(); }
  async findOne(id: string) { return this.prisma.auditLog.findUnique({ where: { id } }); }
  async create(data: any) { return this.prisma.auditLog.create({ data }); }
  async update(id: string, data: any) { return this.prisma.auditLog.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.auditLog.delete({ where: { id } }); }
}
