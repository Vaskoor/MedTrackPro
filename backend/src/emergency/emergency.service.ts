import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class EmergencyService {
  constructor(private prisma: PrismaService) {}

  async sendSOS(userId: string, location: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { patient: true, doctor: true },
    });
    if (!user || !user.patient) throw new Error('Patient not found');
    const alert = await this.prisma.emergencyAlert.create({
      data: {
        patientId: user.patient.id,
        doctorId: user.doctor?.id,
        location,
        status: 'ACTIVE',
      },
    });
    return alert;
  }
}
