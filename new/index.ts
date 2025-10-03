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

// NEW: track manual override ("day", "night", or null)
let manualOverride: "day" | "night" | null = null;

function renderClock(deviceName: string, origin: "tap" | "auto" = "auto") {
  const now = new Date();
  const hour = now.getHours();
  const naturalNightMode = hour >= 22 || hour < 7; // 22:00–08:00

  // Reset override when natural mode flips
  if (origin === "auto") {
    if (naturalNightMode && !lastNightMode) {
      manualOverride = null; // reset when new natural night begins
    } else if (!naturalNightMode && lastNightMode) {
      manualOverride = null; // reset when new natural day begins
    }
  }

  // Decide effective mode
  let nightMode: boolean;
  if (manualOverride === "day") {
    nightMode = false;
  } else if (manualOverride === "night") {
    nightMode = true;
  } else {
    nightMode = naturalNightMode;
  }

  if (nightMode) {
    if (!lastNightMode || manualOverride === "night") {
      // clear once entering night mode
      clearAll(deviceName);
      lastDigits = null;
    }
    lastNightMode = true;
    return;
  } else {
    lastNightMode = false;
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

// --- Tap toggles override ---
lp.onMessage = (event: PadEvent) => {
  const now = new Date();
  const hour = now.getHours();
  const naturalNightMode = hour >= 22 || hour < 7;

  // Toggle depending on natural mode
  if (manualOverride) {
    manualOverride = null; // tapping again clears override
  } else {
    manualOverride = naturalNightMode ? "day" : "night";
  }

  // reset digits so it redraws fully after toggle
  lastDigits = null;
  renderClock(event.deviceName, "tap");
};



setInterval(() => {
  if (lp.devices.length > 0) {
    const deviceName = lp.devices[0].name;
    renderClock(deviceName);
  }
}, 1000);
