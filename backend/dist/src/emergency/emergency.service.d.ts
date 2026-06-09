import { PrismaService } from '../common/prisma/prisma.service';
export declare class EmergencyService {
    private prisma;
    constructor(prisma: PrismaService);
    sendSOS(userId: string, location: string): Promise<{
        id: string;
        location: string | null;
        status: string;
        createdAt: Date;
        patientId: string;
        doctorId: string | null;
    }>;
}
