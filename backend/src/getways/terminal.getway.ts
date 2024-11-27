import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Card } from 'src/entities/card.entity';
import { Terminal } from 'src/entities/terminal.entity';
import { CardService } from 'src/realizations/card/card.service';
import { TerminalService } from 'src/realizations/terminal/terminal.service';

@WebSocketGateway({
  cors: true,
  transport: ['websocket']
})
export class TerminalGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly terminalService: TerminalService,
    private readonly cardService: CardService
  ){}

  handleConnection(client: Socket) {
    //console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    //console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('import')
  async handleImport(
    @ConnectedSocket() client: Socket,
    @MessageBody() terminals : [Terminal, Card][]
  ) {
    for (const [terminal, card] of terminals) {
      const _terminal = await this.terminalService.upsert(terminal);
      const _card = await this.cardService.upsert(card, _terminal);
      if(_card)
        if(!_terminal.active_card || _terminal.active_card.end_date_card.getTime() < new Date(_card.end_date_card).getTime() )
          await this.terminalService.update({ id: _terminal.id, active_card: _card });
    }
    this.sendTerminalList();
  }
  
  @SubscribeMessage('updateTerminal')
  async handleUpdate(
    @MessageBody() terminal: Terminal
  ) {
    const updated_terminal = await this.terminalService.update(terminal)
    this.sendTerminalList()
  }

  @SubscribeMessage('createFN')
  async handleCreateFN(
    @MessageBody() {card, uid_terminal}:{card: Card, uid_terminal: string} 
  ){
    const terminal = await this.terminalService.getOneByUid({uid_terminal})
    const new_card = await this.cardService.add(card, terminal)
  }

  async sendTerminalList(){
    const terminals = await this.terminalService.getAll()
    this.server.emit('terminalListChanged', terminals);
  }
}
