import { Color } from './Colors';
import { LaunchpadManager } from './LaunchpadManager';

const lp = new LaunchpadManager();

const waitFor = (async (ms: number) => new Promise(resolve => setTimeout(resolve, ms)));


lp.onMessage = async (deviceName, message) => {
  const [status, note, velocity] = message;
  console.log(`Device ${deviceName}: note=${note}, velocity=${velocity}, status=${status}`);

  // Flash pad when pressed
  if ((status === 144 || status === 176) && velocity > 0) {

    // for (let i = 48; i <= 127; i++) {
    //   lp.lightPad(deviceName, note, i);

    //   console.log(i)
    //   await waitFor(2000);

    // }

    /*
123 red

17, 18, 19 amber

49, 50, 51 yellow

16, 36, 48 green

    */

    lp.lightPad(deviceName, note, Color.green.high);
    await waitFor(300);
    lp.lightPad(deviceName, note, Color.green.med);
    await waitFor(300);
    lp.lightPad(deviceName, note, Color.green.low);
    await waitFor(300);
    lp.lightPad(deviceName, note, Color.red.high);
    await waitFor(300);
    lp.lightPad(deviceName, note, Color.red.med);
    await waitFor(300);
    lp.lightPad(deviceName, note, Color.red.low);
    await waitFor(300);
    lp.lightPad(deviceName, note, Color.amber.high);
    await waitFor(300);
    lp.lightPad(deviceName, note, Color.amber.med);
    await waitFor(300);
    lp.lightPad(deviceName, note, Color.amber.low);
    await waitFor(300);
    lp.lightPad(deviceName, note, Color.yellow.high);
    await waitFor(300);
    lp.lightPad(deviceName, note, Color.yellow.med);
    await waitFor(300);
    lp.lightPad(deviceName, note, Color.yellow.low);
    await waitFor(300);
    lp.lightPad(deviceName, note, Color.green);
  }
};

// Light the first pad on the first Launchpad
if (lp.devices.length > 0) {
  const firstDevice = lp.devices[0].name;
  lp.lightPad(firstDevice, 36, 127);
}

// Close gracefully
process.on('SIGINT', () => {
  lp.close();
  process.exit();
});
