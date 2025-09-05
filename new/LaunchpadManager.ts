import midi from "midi";

export type MidiMessage = [number, number, number]; // [status, note, velocity]

export interface LaunchpadDevice {
  name: string;
  input: midi.Input;
  output: midi.Output;
}

export type Rotation = 0 | 90 | 180 | 270;

export interface PadEvent {
  deviceName: string;
  message: MidiMessage;
  coords: { x: number; y: number };
}

class BoardHelper {
  rotation: Rotation;

  constructor(rotation: Rotation = 0) {
    this.rotation = rotation;
  }

  getNote(x: number, y: number): number {
    x = Math.max(0, Math.min(7, x));
    y = Math.max(0, Math.min(7, y));

    let col = x;
    let row = y;

    // Apply rotation
    switch (this.rotation) {
      case 0:
        break;
      case 90:
        [col, row] = [7 - row, col];
        break;
      case 180:
        [col, row] = [7 - col, 7 - row];
        break;
      case 270:
        [col, row] = [row, 7 - col];
        break;
    }

    return row * 16 + col;
  }

  getCoords(note: number): { x: number; y: number } {
    let row = Math.floor(note / 16);
    let col = note % 16;

    col = Math.min(col, 7);
    row = Math.min(row, 7);

    let x = col;
    let y = row;

    switch (this.rotation) {
      case 0:
        break;
      case 90:
        [x, y] = [y, 7 - x];
        break;
      case 180:
        [x, y] = [7 - col, 7 - row];
        break;
      case 270:
        [x, y] = [7 - y, col];
        break;
    }

    return { x, y };
  }
}

export class LaunchpadManager {
  devices: LaunchpadDevice[] = [];
  onMessage?: (event: PadEvent) => void;
  private board: BoardHelper;

  constructor(rotation: Rotation = 0) {
    this.board = new BoardHelper(rotation);
    this.scanLaunchpads();
  }

  scanLaunchpads() {
    const output = new midi.Output();
    const launchpads: LaunchpadDevice[] = [];

    for (let i = 0; i < output.getPortCount(); i++) {
      const name = output.getPortName(i);
      if (name.includes("Launchpad")) {
        const out = new midi.Output();
        out.openPort(i);

        const inp = new midi.Input();
        inp.openPort(i);
        inp.ignoreTypes(false, false, false);

        inp.on("message", (deltaTime: number, message: MidiMessage) => {
          const [, note] = message;
          const coords = this.board.getCoords(note);
          if (this.onMessage) {
            this.onMessage({ deviceName: name, message, coords });
          }
        });

        launchpads.push({ name, input: inp, output: out });
      }
    }

    this.devices = launchpads;
    if (launchpads.length === 0) {
      console.log("No Launchpads detected.");
    } else {
      console.log(
        `Detected ${launchpads.length} Launchpad(s):`,
        launchpads.map((d) => d.name)
      );
    }
  }

  /** Light a pad by MIDI note */
  lightPad(deviceName: string, note: number, velocity: number = 127) {
    const device = this.devices.find((d) => d.name === deviceName);
    if (!device) return;
    device.output.sendMessage([144, note, velocity]);
  }

  /** Turn off a pad by MIDI note */
  turnOffPad(deviceName: string, note: number) {
    const device = this.devices.find((d) => d.name === deviceName);
    if (!device) return;
    device.output.sendMessage([128, note, 0]);
  }

  /** Light a pad by coordinates */
  lightPadAt(deviceName: string, x: number, y: number, velocity: number = 127) {
    const note = this.board.getNote(x, y);
    this.lightPad(deviceName, note, velocity);
  }

  /** Turn off a pad by coordinates */
  turnOffPadAt(deviceName: string, x: number, y: number) {
    const note = this.board.getNote(x, y);
    this.turnOffPad(deviceName, note);
  }

  close() {
    this.devices.forEach((d) => {
      d.input.closePort();
      d.output.closePort();
    });
  }
}
