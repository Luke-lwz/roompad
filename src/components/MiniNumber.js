import digitalClockNumbers from "../views/clock/digitalClockNumbers.js";

import { getPrefabGrid } from "../helpers/layers.js";

function MiniNumber(number = 9, color) {

    
    if (number && color && digitalClockNumbers[number]) {
        const miniNrGrid = digitalClockNumbers[number]?.minigrid.map(e => replaceBrightnessWithColorValue(e, color));
        return miniNrGrid;
    } 

    function replaceBrightnessWithColorValue(row, color) {
        return row.map(e => (e === 0 ? null : (color - (3 - e))));
    }

    return getPrefabGrid();
}


export default MiniNumber;