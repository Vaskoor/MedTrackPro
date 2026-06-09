import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.doctor.findMany(); }
  async findOne(id: string) { return this.prisma.doctor.findUnique({ where: { id } }); }
  async create(data: any) { return this.prisma.doctor.create({ data }); }
  async update(id: string, data: any) { return this.prisma.doctor.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.doctor.delete({ where: { id } }); }
}
