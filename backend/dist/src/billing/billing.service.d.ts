import { PrismaService } from '../common/prisma/prisma.service';
export declare class BillingService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        patientId: string;
        status: string;
        description: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        dueDate: Date;
    }[]>;
    pay(id: string, method: string): Promise<{
        id: string;
        createdAt: Date;
        patientId: string;
        status: string;
        description: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        dueDate: Date;
    }>;
}
