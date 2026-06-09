import { LabOrdersService } from './lab-orders.service';
export declare class LabOrdersController {
    private readonly service;
    constructor(service: LabOrdersService);
    findAll(req: any): Promise<{
        id: string;
        patientId: string;
        doctorId: string;
        testName: string;
        status: string;
        resultUrl: string | null;
        orderedAt: Date;
        completedAt: Date | null;
    }[]>;
    create(req: any, testName: string): Promise<{
        id: string;
        patientId: string;
        doctorId: string;
        testName: string;
        status: string;
        resultUrl: string | null;
        orderedAt: Date;
        completedAt: Date | null;
    }>;
}
