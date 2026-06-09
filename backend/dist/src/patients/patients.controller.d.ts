import { PatientsService } from './patients.service';
export declare class PatientsController {
    private readonly service;
    constructor(service: PatientsService);
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
