import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    return this.prisma.billing.findMany({ where: { patientId: patient?.id } });
  }

  async pay(id: string, method: string) {
    return this.prisma.billing.update({
      where: { id },
      data: { status: 'PAID', payments: { create: { amount: 100, method, transactionId: 'mock_txn', status: 'SUCCESS' } } },
    });
  }
}
