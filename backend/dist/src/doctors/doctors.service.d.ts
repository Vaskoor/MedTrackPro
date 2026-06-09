import { PrismaService } from '../common/prisma/prisma.service';
export declare class DoctorsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        userId: string;
        specialization: string | null;
        licenseNumber: string | null;
        yearsExperience: number | null;
        consultationFee: import("@prisma/client/runtime/library").Decimal | null;
        availability: import("@prisma/client/runtime/library").JsonValue | null;
        clinicId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        userId: string;
        specialization: string | null;
        licenseNumber: string | null;
        yearsExperience: number | null;
        consultationFee: import("@prisma/client/runtime/library").Decimal | null;
        availability: import("@prisma/client/runtime/library").JsonValue | null;
        clinicId: string | null;
    } | null>;
    create(data: any): Promise<{
        id: string;
        userId: string;
        specialization: string | null;
        licenseNumber: string | null;
        yearsExperience: number | null;
        consultationFee: import("@prisma/client/runtime/library").Decimal | null;
        availability: import("@prisma/client/runtime/library").JsonValue | null;
        clinicId: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        userId: string;
        specialization: string | null;
        licenseNumber: string | null;
        yearsExperience: number | null;
        consultationFee: import("@prisma/client/runtime/library").Decimal | null;
        availability: import("@prisma/client/runtime/library").JsonValue | null;
        clinicId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        userId: string;
        specialization: string | null;
        licenseNumber: string | null;
        yearsExperience: number | null;
        consultationFee: import("@prisma/client/runtime/library").Decimal | null;
        availability: import("@prisma/client/runtime/library").JsonValue | null;
        clinicId: string | null;
    }>;
}
