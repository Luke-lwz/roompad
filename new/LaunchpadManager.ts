import midi from 'midi';

export type MidiMessage = [number, number, number]; // [status, note, velocity]

export interface LaunchpadDevice {
  name: string;
  input: midi.Input;
  output: midi.Output;
}

export class LaunchpadManager {
  devices: LaunchpadDevice[] = [];
  onMessage?: (deviceName: string, message: MidiMessage) => void;

  constructor() {
    this.scanLaunchpads();
  }

  scanLaunchpads() {
    const output = new midi.Output();
    const input = new midi.Input();
    const launchpads: LaunchpadDevice[] = [];

    for (let i = 0; i < output.getPortCount(); i++) {
      const name = output.getPortName(i);
      if (name.includes('Launchpad')) {
        const out = new midi.Output();
        out.openPort(i);

        const inp = new midi.Input();
        inp.openPort(i);
        inp.ignoreTypes(false, false, false);

        inp.on('message', (deltaTime: number, message: MidiMessage) => {
          if (this.onMessage) this.onMessage(name, message);
        });

        launchpads.push({ name, input: inp, output: out });
      }
    }

    this.devices = launchpads;
    if (launchpads.length === 0) {
      console.log('No Launchpads detected.');
    } else {
      console.log(`Detected ${launchpads.length} Launchpad(s):`, launchpads.map(d => d.name));
    }
  }

  lightPad(deviceName: string, note: number, velocity: number = 127) {
    const device = this.devices.find(d => d.name === deviceName);
    if (!device) return;
    device.output.sendMessage([144, note, velocity]);
  }

  turnOffPad(deviceName: string, note: number) {
    const device = this.devices.find(d => d.name === deviceName);
    if (!device) return;
    device.output.sendMessage([128, note, 0]);
  }

  close() {
    this.devices.forEach(d => {
      d.input.closePort();
      d.output.closePort();
    });
  }
}
