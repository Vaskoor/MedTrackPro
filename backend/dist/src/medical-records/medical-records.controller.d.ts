import { MedicalRecordsService } from './medical-records.service';
export declare class MedicalRecordsController {
    private readonly service;
    constructor(service: MedicalRecordsService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        date: Date;
        patientId: string;
        doctorId: string;
        type: string;
        title: string;
        description: string | null;
        fileUrl: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        date: Date;
        patientId: string;
        doctorId: string;
        type: string;
        title: string;
        description: string | null;
        fileUrl: string | null;
    } | null>;
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        date: Date;
        patientId: string;
        doctorId: string;
        type: string;
        title: string;
        description: string | null;
        fileUrl: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        date: Date;
        patientId: string;
        doctorId: string;
        type: string;
        title: string;
        description: string | null;
        fileUrl: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        date: Date;
        patientId: string;
        doctorId: string;
        type: string;
        title: string;
        description: string | null;
        fileUrl: string | null;
    }>;
}
