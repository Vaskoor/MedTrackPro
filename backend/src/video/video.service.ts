import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.videoSession.findMany(); }
  async findOne(id: string) { return this.prisma.videoSession.findUnique({ where: { id } }); }
  async create(data: any) { return this.prisma.videoSession.create({ data }); }
  async update(id: string, data: any) { return this.prisma.videoSession.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.videoSession.delete({ where: { id } }); }
}
