// o = off, 1 = low, "med" = medium, "high" = full

type BrightnessName = 'off' | 'low' | 'med' | 'high';

export interface DigitDef {
  number: number;
  minigrid: BrightnessName[][];
}

const digitalClockNumbers: DigitDef[] = [
    {
        number: 0,
        minigrid: [
            ["off", "high", "high", "high"],
            ["off", "high", "off", "high"],
            ["off", "high", "off", "high"],
            ["off", "high", "high", "high"],
        ]
    },
    {
        number: 1,
        minigrid: [
            ["off", "off", "off", "high"],
            ["off", "off", "high", "high"],
            ["off", "off", "off", "high"],
            ["off", "off", "off", "high"],
        ]
    },
    {
        number: 2,
        minigrid: [
            ["off", "high", "high", "off"],
            ["off", "off", "off", "high"],
            ["off", "high", "med", "off"],
            ["off", "high", "high", "high"],
        ]
    },
    {
        number: 3,
        minigrid: [
            ["off", "high", "high", "high"],
            ["off", "off", "off", "high"],
            ["off", "off", "med", "high"],
            ["off", "high", "high", "high"],
        ]
    },
    {
        number: 4,
        minigrid: [
            ["off", "high", "off", "high"],
            ["off", "high", "off", "high"],
            ["off", "high", "high", "high"],
            ["off", "off", "off", "high"],
        ]
    },
    {
        number: 5,
        minigrid: [
            ["off", "high", "high", "high"],
            ["off", "high", "off", "off"],
            ["off", "off", "med", "high"],
            ["off", "high", "high", "high"],
        ]
    },
    {
        number: 6,
        minigrid: [
            ["off", "high", "off", "off"],
            ["off", "high", "high", "high"],
            ["off", "high", "off", "high"],
            ["off", "high", "high", "high"],
        ]
    },
    {
        number: 7,
        minigrid: [
            ["off", "high", "high", "high"],
            ["off", "off", "off", "high"],
            ["off", "off", "high", "off"],
            ["off", "off", "high", "off"],
        ]
    },
    {
        number: 8,
        minigrid: [
            ["off", "high", "high", "high"],
            ["off", "high", "off", "high"],
            ["off", "high", "med", "high"],
            ["off", "high", "high", "high"],
        ]
    },
    {
        number: 9,
        minigrid: [
            ["off", "high", "high", "high"],
            ["off", "high", "off", "high"],
            ["off", "high", "high", "high"],
            ["off", "off", "off", "high"],
        ]
    },
]

export default digitalClockNumbers;

