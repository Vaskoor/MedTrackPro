import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class VideoGateway implements OnGatewayConnection {
    server: Server;
    handleConnection(client: Socket): void;
    handleJoinRoom(client: Socket, room: string): void;
    handleSignal(client: Socket, { room, signal }: {
        room: string;
        signal: any;
    }): void;
}
