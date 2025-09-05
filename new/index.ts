import { LaunchpadManager } from './LaunchpadManager';
import { Color } from './Colors';
import digitalClockNumbers from './digitalClockNumbers';

const lp = new LaunchpadManager(90);

function getDigitGrid(num: number) {
  return digitalClockNumbers.find(n => n.number === num)?.minigrid ?? [];
}
function renderDigit(
  deviceName: string,
  digit: number,
  xOffset: number,
  yOffset: number,
  color: typeof Color.green | typeof Color.amber
) {
  const grid = getDigitGrid(digit);
  const now = new Date();
  const hour = now.getHours();
  const nightMode = hour >= 22 || hour < 8; // 22:00–08:00

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const brightnessName = grid[y][x]; // "off" | "low" | "med" | "high"

      let velocity =
        brightnessName === 'off' ? Color.off : color[brightnessName];

      if (nightMode && velocity !== Color.off) {
        // overwrite to low during night
        velocity = color.low;
      }

      lp.lightPadAt(deviceName, x + xOffset, y + yOffset, velocity);
    }
  }
}



function clearDigit(deviceName: string, xOffset: number, yOffset: number) {
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      lp.lightPadAt(deviceName, x + xOffset, y + yOffset, Color.off);
    }
  }
}

let lastDigits: number[] | null = null;

function renderClock(deviceName: string) {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const digits = [...hours, ...minutes].map(d => parseInt(d, 10));

  const positions: [number, number, typeof Color.green | typeof Color.amber][] = [
    [0, 0, Color.green], // hour tens (green)
    [4, 0, Color.green], // hour ones (green)
    [0, 4, Color.amber],   // minute tens (red)
    [4, 4, Color.amber],   // minute ones (red)
  ];

  if (!lastDigits) {
    // first render — draw everything
    digits.forEach((d, i) =>
      renderDigit(deviceName, d, positions[i][0], positions[i][1], positions[i][2])
    );
  } else {
    // only redraw changed digits
    digits.forEach((d, i) => {
      if (d !== lastDigits![i]) {
        clearDigit(deviceName, positions[i][0], positions[i][1]);
        renderDigit(deviceName, d, positions[i][0], positions[i][1], positions[i][2]);
      }
    });
  }

  lastDigits = digits;
}

setInterval(() => {
  if (lp.devices.length > 0) {
    const deviceName = lp.devices[0].name;
    renderClock(deviceName);
  }
}, 1000);
