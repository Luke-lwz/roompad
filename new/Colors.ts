type Highness = 'low' | 'med' | 'high';

interface ColorEntry {
  low: number;
  med: number;
  high: number;
  default: number; // getter for current default
}

class ColorClass {
  private _defaultHighness: Highness;

  off = 0;

  constructor(defaultHighness: Highness = 'med') {
    this._defaultHighness = defaultHighness;
  }

  setDefaultHighness(value: Highness) {
    this._defaultHighness = value;
  }

  private makeColor(levels: Omit<ColorEntry, 'default'>): ColorEntry {
    // Use getter for .default so it returns the current default brightness
    const color: ColorEntry = {
      ...levels,
      get default() {
        const key = (Color as any)._defaultHighness as keyof Omit<ColorEntry, 'default'>;
        return levels[key];
      },
    };
    return color;
  }

  get green(): number & ColorEntry {
    const c = this.makeColor({ low: 16, med: 32, high: 48 });
    // Create a proxy so accessing .low/.med/.high works
    return Object.assign(c.default, c) as number & ColorEntry;
  }

  get red(): number & ColorEntry {
    const c = this.makeColor({ low: 1, med: 2, high: 3 });
    return Object.assign(c.default, c) as number & ColorEntry;
  }

  get amber(): number & ColorEntry {
    const c = this.makeColor({ low: 17, med: 34, high: 51 });
    return Object.assign(c.default, c) as number & ColorEntry;
  }

  get yellow(): number & ColorEntry {
    // Yellow uses amber for low/med, 50 for high
    const c = this.makeColor({ low: 17, med: 34, high: 50 });
    return Object.assign(c.default, c) as number & ColorEntry;
  }
}

export const Color = new ColorClass('high');

// // Usage examples
// console.log(Color.green);       // default (32)
// console.log(Color.green.low);   // 16
// console.log(Color.green.med);   // 32
// console.log(Color.green.high);  // 48

// console.log(Color.yellow);      // default (34)
// console.log(Color.yellow.low);  // 17
// console.log(Color.yellow.med);  // 34
// console.log(Color.yellow.high); // 50

// // Change default brightness globally
// Color.setDefaultHighness('high');
// console.log(Color.green);       // 48
// console.log(Color.yellow);      // 50

