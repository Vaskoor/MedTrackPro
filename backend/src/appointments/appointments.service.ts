import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.appointment.findMany(); }
  async findOne(id: string) { return this.prisma.appointment.findUnique({ where: { id } }); }
  async create(data: any) { return this.prisma.appointment.create({ data }); }
  async update(id: string, data: any) { return this.prisma.appointment.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.appointment.delete({ where: { id } }); }
}
