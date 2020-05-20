import * as fs from 'fs';
import * as path from 'path';

import { EventChannel } from '../common/services/eventChannel';
import { NetworkModule } from './networkModule';
import { TerminalModule } from './terminalModule';
import { WorldModule } from './worldModule';
import { ScriptLoader } from '../common/utils/scriptLoader';
import { TimerManager } from '../common/utils/timerManager';

export class Emojiland {
    public static instance: Emojiland;
    readonly version = {
        major: 0,
        minor: 0,
        patch: 20
    };

    // root = ~/server/
    rootDirectory = __dirname;

    // Main modules
    events: EventChannel;
    network: NetworkModule;
    terminal: TerminalModule;
    world: WorldModule;

    // Timer-based properties
    isRunning = false;
    tps = 60;
    timePerTick = 1000 / this.tps;
    serverTicks = 0;
    accumulator = 0;
    deltas: number[] = [];
    startTime: Date = new Date();
    lastUpdate = this.startTime.getTime();
    emojilandLoop: NodeJS.Timer;
    timers: TimerManager = new TimerManager();
    getAverageTickTime() {
        let avg = 0;
        for (let d of this.deltas) {
            avg += d;
        }
        avg = avg / this.deltas.length;
        if (this.deltas.length > 10) this.deltas.pop();
        return avg;
    }

    /**
     * Initialization constructor for application.
     * @param config Optional configuration object for Emojiland application.
     */
    constructor () {
        if (!Emojiland.instance) Emojiland.instance = this;

        console.log(`
=====================================================================
                          __.__.__                     .___
  ____   _____   ____    |__|__|  | _____    ____    __| _/
_/ __ \\ /     \\ /  _ \\   |  |  |  | \\__  \\  /    \\  / __ |
\\  ___/|  Y Y  (  <_> )  |  |  |  |__/ __ \\\|   |  \\/ /_/ |
 \\___  >__|_|  /\\____/\\__|  |__|____(____  /___|  /\\____ |
     \\/      \\/      \\______|            \\/     \\/      \\/
=====================================================================
(v${this.version.major}.${this.version.minor}.${this.version.patch})`);
        console.log('\n');

        // create Emojiland event channel
        const events = this.events = new EventChannel();

        // create network and terminal modules
        this.network = new NetworkModule(this);
        this.world = new WorldModule(this);
        this.terminal = new TerminalModule(this);

        // Load all the scripts in the scripts folder
        // console.log('loading command scripts...');
        // const scripts = ScriptLoader.load(this.rootDirectory + '/scripts');
        // console.log('...finished loading scripts');

        // to network
        events.on('world', (data) => this.onWorld(data));
        events.on('world/update', (data) => this.onWorldUpdate(data));
        events.on('entity', (data) => this.onEntity(data));
        events.on('entity/update', (data) => this.onEntityUpdate(data));
        events.on('entity/destroy', (data) => this.onEntityDestroy(data));

        // misc
        events.on('terminal/command', (data) => this.onTerminalCommand(data));
    }

    /**
     * Main Emojiland application logic loop
     */
    private update() {
        // update times
        this.serverTicks++;
        const now = new Date().getTime();
        const delta = now - this.lastUpdate;
        this.lastUpdate = now;

        // process server timers
        this.timers.process(delta);

        // process event queue
        this.events.process();

        // update each module
        this.accumulator += delta;
        while (this.accumulator >= this.timePerTick) {
            this.world.update(this.timePerTick);
            this.accumulator -= this.timePerTick;
        }

        // asynchronous loop
        if (this.isRunning) {
            this.emojilandLoop = setTimeout(() => this.update(), this.timePerTick);
        } else {
            // this.exit();
        }
    }
    /**
     * Begins running the Emojiland application loop.
     */
    run() {
        this.isRunning = true;
        this.update();
    }
    /**
     * Pauses execution of Emojiland application.
     */
    pause() {
        this.isRunning = false;
    }
    /**
     * Exiting process for application.
     */
    exit() {
        process.exit();
    }

    // to Network
    onWorld (data: any) {
        // broadcast new world
        this.network.broadcast('world', data);
    }
    onWorldUpdate (data: any) {
        this.network.broadcast('world/update', data);
    }
    onEntity (data: any) {
        this.network.broadcast('entity', data);
    }
    onEntityUpdate (data: any) {
        this.network.broadcast('entity/update', data);
    }
    onEntityDestroy (data: any) {
        this.network.broadcast('entity/destroy', data);
    }
    onTerminalCommand (data: any) {
        // const entity = this.world.onNewClient();
        // this.socketEntities[entity.serial] = packet.socket.id;
        // packet.socket.send('world/playerEntity', new ServerPackets.PlayerEntity(entity));
    }
}