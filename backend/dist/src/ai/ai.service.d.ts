import { PrismaService } from '../common/prisma/prisma.service';
export declare class AiService {
    private prisma;
    constructor(prisma: PrismaService);
    getInsights(patientId: string): Promise<{
        message: string;
        riskLevel: string;
    }>;
}
