import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class VideoGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Video client connected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.to(room).emit('user-joined', client.id);
  }

  @SubscribeMessage('signal')
  handleSignal(client: Socket, { room, signal }: { room: string; signal: any }) {
    client.to(room).emit('signal', { sender: client.id, signal });
  }
}
