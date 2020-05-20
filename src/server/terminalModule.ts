import { ScriptLoader } from '../common/utils/scriptLoader';
import { EventChannel } from '../common/services/eventChannel';
import { Emojiland } from './emojiland';

/**
 * Base Command class for creating terminal commands.
 */
export class Command implements ICommand {
    constructor(private terminal: TerminalModule, public commandName: string, public execute: () => void, ) {
        terminal.addCommand(this);
    }
}
interface ICommand {
    commandName: string;
    execute(): void;
}

export class TerminalModule {
    static instance: TerminalModule;
    private commands: { [commandName: string]: Command } = {};
    private serverStartTime = new Date();
    private input: NodeJS.ReadStream;
    private output: NodeJS.WriteStream;
    private inputBuffer: (string | Buffer)[] = [];

    constructor(emojiland: Emojiland, options?: any) {
        if (process.stdin.isTTY) {
            process.stdin.setEncoding('utf8');
            process.stdin.on('data', (chunk) => {
                console.log(chunk);
                this.parseInput(chunk);
            });
        }

        // start terminal
        console.log('terminal started...');
        TerminalModule.instance = this;
    }
    update () {
        // this.resetScreen();
        // this.printScreen();
        // this.readInput();
    }
    resetScreen() {
        console.clear();
    }
    parseInput(chunk: string) {
        // sanitize chunk
        chunk = chunk.replace('\r', '');
        let params = chunk.split(' ');
        let command = params.shift();
        if (command && this.commands[command]) {
            this.commands[command].execute.apply(this, params);
        } else {
            console.log('There is no "' + command + '" command.');
            console.log('Available commands:');
            for (let commandName in this.commands) {
                console.log('    ' + commandName);
            }
        }
    }
    addCommand(command: Command) {
        this.commands[command.commandName] = command;
    }
    getUptime () {
        return Date.now() - this.serverStartTime.getTime();
    }
}
