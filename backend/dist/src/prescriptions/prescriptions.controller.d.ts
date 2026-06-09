import { PrescriptionsService } from './prescriptions.service';
export declare class PrescriptionsController {
    private readonly service;
    constructor(service: PrescriptionsService);
    findAll(): Promise<({
        doctor: {
            user: {
                id: string;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                phone: string | null;
                isActive: boolean;
                isEmailVerified: boolean;
                mfaEnabled: boolean;
                mfaSecret: string | null;
                lastLoginAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            userId: string;
            specialization: string | null;
            licenseNumber: string | null;
            yearsExperience: number | null;
            consultationFee: import("@prisma/client/runtime/library").Decimal | null;
            availability: import("@prisma/client/runtime/library").JsonValue | null;
            clinicId: string | null;
        };
        medicines: {
            id: string;
            medicineName: string;
            dosage: string;
            frequency: string;
            duration: string;
            instructions: string | null;
            prescriptionId: string;
        }[];
    } & {
        id: string;
        date: Date;
        notes: string | null;
        patientId: string;
        doctorId: string;
    })[]>;
    findOne(id: string): Promise<{
        id: string;
        date: Date;
        notes: string | null;
        patientId: string;
        doctorId: string;
    } | null>;
    create(data: any): Promise<{
        id: string;
        date: Date;
        notes: string | null;
        patientId: string;
        doctorId: string;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        date: Date;
        notes: string | null;
        patientId: string;
        doctorId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        date: Date;
        notes: string | null;
        patientId: string;
        doctorId: string;
    }>;
}
