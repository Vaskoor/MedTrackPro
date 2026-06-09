import { EmergencyService } from './emergency.service';
export declare class EmergencyController {
    private readonly service;
    constructor(service: EmergencyService);
    sendSOS(req: any, location: string): Promise<{
        id: string;
        location: string | null;
        status: string;
        createdAt: Date;
        patientId: string;
        doctorId: string | null;
    }>;
}
