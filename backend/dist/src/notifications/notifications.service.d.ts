import { PrismaService } from '../common/prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: string;
        title: string;
        isRead: boolean;
    }[]>;
    findOne(id: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: string;
        title: string;
        isRead: boolean;
    } | null>;
    create(data: any): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: string;
        title: string;
        isRead: boolean;
    }>;
    update(id: string, data: any): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: string;
        title: string;
        isRead: boolean;
    }>;
    remove(id: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: string;
        title: string;
        isRead: boolean;
    }>;
}
