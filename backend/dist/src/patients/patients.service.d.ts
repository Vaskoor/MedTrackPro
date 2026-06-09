import { PrismaService } from '../common/prisma/prisma.service';
export declare class PatientsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        dateOfBirth: Date | null;
        bloodGroup: string | null;
        allergies: string | null;
        chronicDiseases: string | null;
        emergencyContact: string | null;
        emergencyPhone: string | null;
        insuranceProvider: string | null;
        insuranceNumber: string | null;
        userId: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        dateOfBirth: Date | null;
        bloodGroup: string | null;
        allergies: string | null;
        chronicDiseases: string | null;
        emergencyContact: string | null;
        emergencyPhone: string | null;
        insuranceProvider: string | null;
        insuranceNumber: string | null;
        userId: string;
    } | null>;
    create(data: any): Promise<{
        id: string;
        dateOfBirth: Date | null;
        bloodGroup: string | null;
        allergies: string | null;
        chronicDiseases: string | null;
        emergencyContact: string | null;
        emergencyPhone: string | null;
        insuranceProvider: string | null;
        insuranceNumber: string | null;
        userId: string;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        dateOfBirth: Date | null;
        bloodGroup: string | null;
        allergies: string | null;
        chronicDiseases: string | null;
        emergencyContact: string | null;
        emergencyPhone: string | null;
        insuranceProvider: string | null;
        insuranceNumber: string | null;
        userId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        dateOfBirth: Date | null;
        bloodGroup: string | null;
        allergies: string | null;
        chronicDiseases: string | null;
        emergencyContact: string | null;
        emergencyPhone: string | null;
        insuranceProvider: string | null;
        insuranceNumber: string | null;
        userId: string;
    }>;
}
