import { PrismaService } from '../common/prisma/prisma.service';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        patientId: string | null;
        doctorId: string | null;
        fileUrl: string | null;
        isRead: boolean;
        senderId: string;
        receiverId: string;
        content: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        patientId: string | null;
        doctorId: string | null;
        fileUrl: string | null;
        isRead: boolean;
        senderId: string;
        receiverId: string;
        content: string;
    } | null>;
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        patientId: string | null;
        doctorId: string | null;
        fileUrl: string | null;
        isRead: boolean;
        senderId: string;
        receiverId: string;
        content: string;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        patientId: string | null;
        doctorId: string | null;
        fileUrl: string | null;
        isRead: boolean;
        senderId: string;
        receiverId: string;
        content: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        patientId: string | null;
        doctorId: string | null;
        fileUrl: string | null;
        isRead: boolean;
        senderId: string;
        receiverId: string;
        content: string;
    }>;
}
