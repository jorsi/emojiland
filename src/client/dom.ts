import { Client } from './client';
import { WorldModule } from './worldModule';
import { EventChannel } from '../common/services/eventChannel';
import { Point2D } from '../common/data/point2d';
import * as Components from './components/';
export class DOMRenderer {
    client: Client;
    root: Element;
    events: EventChannel;
    socket: SocketIO.Socket;
    components: Components.Component[] = [];
    width: number;
    height: number;
    constructor (client: Client) {
        this.client = client;
        let events = this.events = client.events;

        // html setup
        this.root = <Element>document.querySelector('#emojiland');

        // general browser events
        window.addEventListener('resize',       (e: Event) => this.onWindowResize(e));
        window.addEventListener('contextmenu',  (e) => e.preventDefault()); // prevents context menu

        // socket
        events.on('connect', (socket) => this.socket = socket);
    }
    render (interpolation: number) {
        this.components.forEach(c => c.render());
    }
    addComponent <T extends Components.Component> (comp: T) {
        this.components.push(comp);
        this.root.appendChild(comp);
        return comp;
    }
    removeComponent (serial: string) {
        let htmlElement = <Components.Component>document.querySelector('#' + serial);
        if (htmlElement) htmlElement.remove();
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].serial === serial) {
                this.components.splice(i, 1);
                break;
            }
        }
    }
    onWindowResize (e: Event) {
        let window = <Window>e.currentTarget;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.components.forEach(c => c.resize(window.innerWidth, window.innerHeight));
    }
}