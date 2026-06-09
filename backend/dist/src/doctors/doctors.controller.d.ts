import { DoctorsService } from './doctors.service';
export declare class DoctorsController {
    private readonly service;
    constructor(service: DoctorsService);
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
