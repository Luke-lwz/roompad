import digitalClockNumbers from "./digitalClockNumbers.js";




let hueDataRefreshInterval = 7; // seconds
let hueDataRefreshCooldown = hueDataRefreshInterval;


class ClockView {
    constructor(state, toolbar, settings, func, util) {
        this.state = state;
        this.toolbar = toolbar;
        this.settings = settings;
        this.func = func;
        this.util = util;

        this.time = { h: null, m: null };

    }

    mount() {
        this.asyncMount();
        this.clock()
        this.state.setIntervalFunction("second", () => this.onSecondInterval())
        this.loadToolbar();



    }

    async asyncMount() {


        this.loadLightControls();
    }

    onClick() {

    }

    onToolbarClick() {

    }

    onSecondInterval() {
        this.clock();


        // hue
        if (hueDataRefreshCooldown <= 0) {
            this.loadLightControls();
            hueDataRefreshCooldown = hueDataRefreshInterval;
        } else {
            hueDataRefreshCooldown--;
        }
    }

    loadToolbar(prefab) {
        const toolbar = (prefab ? prefab : this.toolbar.getPrefabToolbar());
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



    // lights


    async loadLightControls() {
        let hue = this.util.hue;
        if (!hue) return

        const groups = await hue.groups.getAll();

        const arr = this.toolbar.getPrefabToolbar();

        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];

            arr[(arr.length - (i + 1))] = {
                id: (group.on ? 3 : 12),
                onClick: (k) => this.onHueGroupClick(k, group)
            }
        }


        this.loadToolbar(arr);
    }


    async onHueGroupClick(k, group) {
        if (k.up) return
        let hue = this.util.hue;
        if (!hue) return


        hue.groups.getById(group.id)
            .then(fetchedGroup => {
                fetchedGroup.on = !group.on

                // save
                hue.groups.save(fetchedGroup);

                // load
                return this.loadLightControls();
            })
            .catch(error => {});
    }




}


function connectGridsX(a, b) {
    if (!a || !b) return
    let c = [];
    for (const i in a) {
        if (Object.hasOwnProperty.call(a, i) && Object.hasOwnProperty.call(b, i)) {
            const rowA = a[i];
            const rowB = b[i];
            c = [...c, [...rowA, ...rowB]];
        }
    }

    return c;
}


function connectGridsY(a, b) {
    if (!a || !b) return
    const c = [...a, ...b];
    return c;
}

export default ClockView