import * as http from 'http';
import * as express from 'express';
import * as io from 'socket.io';
import * as path from 'path';

import { Emojiland } from './emojiland';
import { EventChannel } from '../common/services/eventChannel';

export class NetworkModule {
  emojiland: Emojiland;
  publicDirectory: string;
  httpServer: http.Server;
  app: express.Application;
  io: SocketIO.Server;
  sockets: SocketIO.Socket[] = [];
  events: EventChannel;

  constructor (emojiland: Emojiland) {
    const events = this.events = emojiland.events;
    this.publicDirectory = path.join(emojiland.rootDirectory, '../public');

    // create express application
    this.app = express();
    this.app.use(express.static(this.publicDirectory));
    this.app.get('/', (req, res) => {
        res.sendFile(this.publicDirectory + '/index.html');
    });

    // create the node http server
    this.httpServer = http.createServer(this.app);

    // attach socket server to http server
    this.io = io(this.httpServer);

    // start up http server
    this.httpServer.listen(3000);

    // initial connection socket from client
    this.io.on('connection', (socket) => events.emit('connection', socket));
  }
  broadcast (event: string, data?: any) {
    console.log(`>> network broadcast '${event}': ${JSON.stringify(data).substr(0, 50)}`);
    this.io.emit(event, data);
  }
}
