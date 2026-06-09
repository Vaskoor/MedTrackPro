import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly service;
    constructor(service: ChatService);
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
