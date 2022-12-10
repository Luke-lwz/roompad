import digitalClockNumbers from "./digitalClockNumbers.js";


class ClockView {
    constructor(state, toolbar, settings, func) {
        this.state = state;
        this.toolbar = toolbar;
        this.settings = settings;
        this.func = func;

        this.time = { h: null, m: null };
    }

    mount() {
        this.clock()
        this.state.setIntervalFunction("second", () => this.clock())
        this.loadToolbar();
    }

    onClick() {

    }

    onToolbarClick() {

    }

    loadToolbar() {
        const toolbar = this.toolbar.getPrefabToolbar();
        toolbar[0] = { id: 6, onClick: (key) => this.changeNightMode(key) }
        this.toolbar.setToolbar(toolbar);
    }


    // your code
    clock() {

        // testing (goes throuh all colors from 0 - 9999 and displays them)
        // for (let i = 0; i <= 9999; i++) {
        //     let str = String(i).padStart(4, '0');
        //     let h = str[0] + str[1];
        //     let m = str[2] + str[3];
        //     this.renderDigitalClock(h, m);
        // }
        // return 

        let date = new Date();
        let h = "" + date.getHours();
        let m = "" + date.getMinutes();
        h = h.padStart(2, '0');
        m = m.padStart(2, '0');

        if (this.time.h !== h || this.time.m !== m) {
            this.time = { h, m };
            this.renderDigitalClock(h, m);

        }
    }



    renderDigitalClock(hh, mm) {
        const hhArray = getHH(hh, 3);
        const mmArray = getMM(mm, 9);

        const grid = connectGridsY(hhArray, mmArray);

        this.state.setGrid(grid);



        function getHH(hh, color = 3) {
            const miniNrGrid1 = digitalClockNumbers[hh[0]]?.minigrid.map(e => replaceBrightnessWithColorValue(e, color));
            const miniNrGrid2 = digitalClockNumbers[hh[1]]?.minigrid.map(e => replaceBrightnessWithColorValue(e, color));
            const upperGridHalf = connectGridsX(miniNrGrid1, miniNrGrid2)
            return upperGridHalf;
        }


        function getMM(mm, color = 9) {
            const miniNrGrid1 = digitalClockNumbers[mm[0]]?.minigrid.map(e => replaceBrightnessWithColorValue(e, color));
            const miniNrGrid2 = digitalClockNumbers[mm[1]]?.minigrid.map(e => replaceBrightnessWithColorValue(e, color));
            const lowerGridHalf = connectGridsX(miniNrGrid1, miniNrGrid2)
            return lowerGridHalf;
        }




        function replaceBrightnessWithColorValue(row, color) {
            return row.map(e => (e === 0 ? null : (color - (3 - e))));
        }
    }



    changeNightMode(key) {
        if (key.up) return;
        this.func.toggleNightMode();
    }




}


function connectGridsX(a, b) {
    if (!a || !b) return
    let c = [];
    for (const i in a) {
        if (Object.hasOwnProperty.call(a, i) && Object.hasOwnProperty.call(b, i)) {
            const rowA = a[i];
            const rowB = b[i];
            c = [[...rowA, ...rowB], ...c];
        }
    }

    return c;
}


function connectGridsY(a, b) {
    if (!a || !b) return
    const c = [...b, ...a];
    return c;
}

export default ClockView