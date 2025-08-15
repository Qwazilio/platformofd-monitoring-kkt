import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Card } from 'src/entities/card.entity';
import { Terminal } from 'src/entities/terminal.entity';
import { CardService } from 'src/realizations/card/card.service';
import { TerminalService } from 'src/realizations/terminal/terminal.service';

@WebSocketGateway({
  cors: true,
  transport: ['websocket'],
  namespace: 'KKT',
})
export class TerminalGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly terminalService: TerminalService,
    private readonly cardService: CardService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const kkts = await this.terminalService.getAll();
      client.emit('kktsList', kkts);
    } catch (error) {
      console.error(error);
    }
  }

  handleDisconnect(client: Socket) {
    //console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('importKkts')
  async handleImport(
    @ConnectedSocket() client: Socket,
    @MessageBody() kkts: Partial<Terminal>[],
  ) {
    try {
      for (const kkt of kkts) {
        await this.terminalService.upsert(kkt);
      }
      await this.sendTerminalList();
      return true;
    } catch (error) {
      console.error('Error importing KKTs:', error);
      return false;
    }
  }

  @SubscribeMessage('updateKkt')
  async handleUpdate(@MessageBody() kkt: Terminal) {
    try {
      await this.terminalService.update(kkt);
      this.server.emit('kktUpdated', kkt);
      return true;
    } catch (error) {
      console.error('Error updating KKT:', error);
      return false;
    }
  }

  @SubscribeMessage('createFN')
  async handleCreateFN(
    @MessageBody() { card, uid_kkt }: { card: Card; uid_kkt: string },
  ) {
    try {
      const kkt = await this.terminalService.attachCard(uid_kkt, card);
      this.server.emit('kktUpdated', kkt);
      return true;
    } catch (error) {
      console.error('Error creating FN:', error);
      return false;
    }
  }

  async sendTerminalList() {
    const terminals = await this.terminalService.getAll();
    this.server.emit('kktsList', terminals);
  }
}
