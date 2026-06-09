import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async getInsights(patientId: string) {
    const vitals = await this.prisma.vitalSign.findMany({
      where: { patientId },
      orderBy: { recordedAt: 'desc' },
      take: 5,
    });
    const bp = vitals.find(v => v.type === 'BLOOD_PRESSURE')?.value;
    let message = 'Your health metrics are stable. Keep up the good work!';
    if (bp && bp !== '120/80 mmHg') {
      message = 'Your blood pressure is slightly elevated. Consider reducing salt intake.';
    }
    return { message, riskLevel: 'LOW' };
  }
}
