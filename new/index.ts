import { LaunchpadManager, PadEvent } from "./LaunchpadManager";
import { Color } from "./Colors";
import digitalClockNumbers from "./digitalClockNumbers";

const lp = new LaunchpadManager(0);



function getDigitGrid(num: number) {
  return digitalClockNumbers.find((n) => n.number === num)?.minigrid ?? [];
}

function renderDigit(
  deviceName: string,
  digit: number,
  xOffset: number,
  yOffset: number,
  color: typeof Color.green | typeof Color.red
) {
  const grid = getDigitGrid(digit);

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const brightnessName = grid[y][x]; // "off" | "low" | "med" | "high"

      const velocity =
        brightnessName === "off" ? Color.off : color[brightnessName];

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

function clearAll(deviceName: string) {
  // Clear full 8x8 Launchpad
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      lp.lightPadAt(deviceName, x, y, Color.off);
    }
  }
}

let lastDigits: number[] | null = null;
let lastNightMode: boolean | null = null;
let padOff = false;

function renderClock(deviceName: string, origin: "tap" | "auto" = "auto") {
  const now = new Date();
  const hour = now.getHours();
  const nightMode = hour >= 22 || hour < 8; // 22:00–08:00


  if (origin === "auto") {
    // handle night mode on auto update without clearing the display (will be done when padOff is set to true)
    if (nightMode !== lastNightMode) {
      padOff = nightMode;
      lastNightMode = nightMode;

      if (padOff) {
        clearAll(deviceName);
        return;
      }
    }
    

  } else if (origin === "tap") {
    // toggle pad on/off on tap
    if (padOff) {
      padOff = false;
    } else {
      padOff = true;
    }
  }

  
  if (padOff) {
    clearAll(deviceName);
    return;
  }

  const hours = hour.toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const digits = [...hours, ...minutes].map((d) => parseInt(d, 10));

  const positions: [number, number, typeof Color.green | typeof Color.red][] =
    [
      [0, 0, Color.green], // hour tens (green)
      [4, 0, Color.green], // hour ones (green)
      [0, 4, Color.red],   // minute tens (red)
      [4, 4, Color.red],   // minute ones (red)
    ];

  if (!lastDigits) {
    // first render — draw everything
    digits.forEach((d, i) =>
      renderDigit(
        deviceName,
        d,
        positions[i][0],
        positions[i][1],
        positions[i][2]
      )
    );
  } else {
    // only redraw changed digits
    digits.forEach((d, i) => {
      if (d !== lastDigits![i]) {
        clearDigit(deviceName, positions[i][0], positions[i][1]);
        renderDigit(
          deviceName,
          d,
          positions[i][0],
          positions[i][1],
          positions[i][2]
        );
      }
    });
  }

  lastDigits = digits;
}

lp.onMessage = (event: PadEvent) => {
  renderClock(event.deviceName, "tap");
}

setInterval(() => {
  if (lp.devices.length > 0) {
    const deviceName = lp.devices[0].name;
    renderClock(deviceName);
  }
}, 1000);
