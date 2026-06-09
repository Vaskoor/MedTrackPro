import { PrismaService } from '../common/prisma/prisma.service';
export declare class HealthService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        date: Date;
        patientId: string;
        sleepHours: number | null;
        activityMinutes: number | null;
        waterIntake: number | null;
        steps: number | null;
        symptoms: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        date: Date;
        patientId: string;
        sleepHours: number | null;
        activityMinutes: number | null;
        waterIntake: number | null;
        steps: number | null;
        symptoms: string | null;
    } | null>;
    create(data: any): Promise<{
        id: string;
        date: Date;
        patientId: string;
        sleepHours: number | null;
        activityMinutes: number | null;
        waterIntake: number | null;
        steps: number | null;
        symptoms: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        date: Date;
        patientId: string;
        sleepHours: number | null;
        activityMinutes: number | null;
        waterIntake: number | null;
        steps: number | null;
        symptoms: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        date: Date;
        patientId: string;
        sleepHours: number | null;
        activityMinutes: number | null;
        waterIntake: number | null;
        steps: number | null;
        symptoms: string | null;
    }>;
}
