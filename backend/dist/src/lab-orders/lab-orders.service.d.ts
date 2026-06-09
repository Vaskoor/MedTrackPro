import { PrismaService } from '../common/prisma/prisma.service';
export declare class LabOrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(patientId: string): Promise<{
        id: string;
        patientId: string;
        doctorId: string;
        status: string;
        testName: string;
        resultUrl: string | null;
        orderedAt: Date;
        completedAt: Date | null;
    }[]>;
    create(patientId: string, doctorId: string, testName: string): Promise<{
        id: string;
        patientId: string;
        doctorId: string;
        status: string;
        testName: string;
        resultUrl: string | null;
        orderedAt: Date;
        completedAt: Date | null;
    }>;
}
