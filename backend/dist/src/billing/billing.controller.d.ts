import { BillingService } from './billing.service';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    findAll(req: any): Promise<{
        id: string;
        patientId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        description: string;
        status: string;
        dueDate: Date;
        createdAt: Date;
    }[]>;
    pay(id: string): Promise<{
        id: string;
        patientId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        description: string;
        status: string;
        dueDate: Date;
        createdAt: Date;
    }>;
}
