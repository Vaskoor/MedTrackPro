import { PrismaService } from '../common/prisma/prisma.service';
export declare class MedicalRecordsService {
    private prisma;
    constructor(prisma: PrismaService);
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
