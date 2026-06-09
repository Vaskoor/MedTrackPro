import { PrismaService } from '../common/prisma/prisma.service';
export declare class VideoService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        patientId: string;
        doctorId: string;
        status: string;
        appointmentId: string;
        startTime: Date;
        endTime: Date | null;
        recordingUrl: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        patientId: string;
        doctorId: string;
        status: string;
        appointmentId: string;
        startTime: Date;
        endTime: Date | null;
        recordingUrl: string | null;
    } | null>;
    create(data: any): Promise<{
        id: string;
        patientId: string;
        doctorId: string;
        status: string;
        appointmentId: string;
        startTime: Date;
        endTime: Date | null;
        recordingUrl: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        patientId: string;
        doctorId: string;
        status: string;
        appointmentId: string;
        startTime: Date;
        endTime: Date | null;
        recordingUrl: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        patientId: string;
        doctorId: string;
        status: string;
        appointmentId: string;
        startTime: Date;
        endTime: Date | null;
        recordingUrl: string | null;
    }>;
}
