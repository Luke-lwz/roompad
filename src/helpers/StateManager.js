import localStorage from "../localStorage/localStorage.js";

class StateManager {
    constructor(pad, settings) {
        this.settings = settings;
        this.pad = pad

        this.brightnessNameArray = ["low", "low", "medium", "full"];

        this.shapes = [ // every dataset in here is a shape
            {
                id: 0,
                color: "off",
                brightness: 3,
                pad: this.pad.off
            },
            {
                id: 1,
                color: "green",
                brightness: 1,
                pad: this.pad.green.low
            },
            {
                id: 2,
                color: "green",
                brightness: 2,
                pad: this.pad.green.medium
            },
            {
                id: 3,
                color: "green",
                brightness: 3,
                pad: this.pad.green.full
            },
            {
                id: 4,
                color: "yellow",
                brightness: 1,
                pad: this.pad.amber.low
            },
            {
                id: 5,
                color: "yellow",
                brightness: 2,
                pad: this.pad.yellow.medium
            },
            {
                id: 6,
                color: "yellow",
                brightness: 3,
                pad: this.pad.yellow.full
            },
            {
                id: 7,
                color: "amber",
                brightness: 1,
                pad: this.pad.amber.low
            },
            {
                id: 8,
                color: "amber",
                brightness: 2,
                pad: this.pad.amber.medium
            },
            {
                id: 9,
                color: "amber",
                brightness: 3,
                pad: this.pad.amber.full
            },
            {
                id: 10,
                color: "red",
                brightness: 1,
                pad: this.pad.red.low
            },
            {
                id: 11,
                color: "red",
                brightness: 2,
                pad: this.pad.red.medium
            },
            {
                id: 12,
                color: "red",
                brightness: 3,
                pad: this.pad.red.full
            },
        ]

        let grid = []
        for (let i = 0; i < 8; i++) {
            const row = [{ id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }];
            grid = [...grid, row]
        }
        this.grid = grid;


        this.storageAddress = null;




        // intervals
        this.INTERVAL_FUNCTIONS = {
            second: () => { },
            minute: () => { },
        }
        setInterval(() => this.INTERVAL_FUNCTIONS.second(), 1 * 1000);
        setInterval(() => this.INTERVAL_FUNCTIONS.minute(), 1 * 60 * 1000);
    }




    // EVENTS
    onClick(k) {
        const state = this.getKey(k);
        if (state?.onClick) {
            let shape = this.getShapeFromId(state?.id);
            state.onClick({ ...k, shape, set: (data) => this.setKey(k, data), setId: (id) => this.setKeyId(k, id) });
        }
    }




    // SET
    setGrid(grid, options = {}) { // 2 Dimensional array exact length in all directions = 8, data can be either: obj = {id: 3, onClick: () => {}} || just an integer with the id;
        if (!grid) return;
        const { restore } = options; // if restore then it will replace all ids without affecting onClick

        var storage = null;
        if (restore) {
            storage = this.getStorage();
        }

        let newGrid = [
            [], [], [], [], [], [], [], [],
        ]

        for (let x = 0; x <= 7; x++) {
            for (let y = 0; y <= 7; y++) {
                let data = grid[x][y];
                if (data) {
                    if (typeof (data) === "number") data = { id: data };
                    newGrid[x][y] = {
                        id: (storage && storage?.[x]?.[y] ? storage[x][y].id : data.id),
                        onClick: data.onClick
                    };
                } else { // if no data exists then render "off"
                    newGrid[x][y] = {
                        id: (storage && storage?.[x]?.[y] ? storage[x][y].id : this.shapes[0].id)
                    };
                }
            }

        }

        this.grid = newGrid;

        this.render();
    }



    setIntervalFunction(type, func) { // type:String => ("second" || "minute")
        this.INTERVAL_FUNCTIONS[type] = func;
    }


    setKey(key, data) { // data can be either: obj = {id: 3, onClick: () => {}} || just an integer with the id;
        if (!key || !data) return

        if (typeof (data) === "number") data = { id: data };

        const shape = this.getShapeFromId(data.id);

        // set in state 
        this.grid[key[0]][key[1]] = { id: shape.id, onClick: data.onClick };


        this.renderKey(key, shape)

    }


    setKeyId(key, id) { // only changes id not onClick function
        if (!key || !key) return

        const shape = this.getShapeFromId(id);

        // set in state 
        const keyState = this.getKey(key);
        this.grid[key[0]][key[1]] = { id, onClick: keyState.onClick };


        this.renderKey(key, shape)
    }




    // GET


    getShapeFromId(id) {

        if (this.settings.nightmode) { // if there is nightmode turned on return lowest brightness value, regardless 
            let shape = this.shapes[id] || this.shapes[0];
            const shapesWithMatchingColor = this.shapes.filter(e => e.color === shape.color);
            if (shapesWithMatchingColor[0]) {
                return shapesWithMatchingColor[0] // lowest brightness shape
            }
        }


        return this.shapes[id] || this.shapes[0];
    }


    getShapeFromColors(color, brightness = 3) {
        return this.shapes.filter(e => (e.color === color && e.brightness === brightness))?.[0] || this.shapes[0];
    }




    getKey(key) { // key => Array => [x, y]
        const keyState = this.grid[key[0]][key[1]]
        const shape = this.getShapeFromId(keyState?.id);
        return { ...keyState, shape };
    };






    // Rendering 

    renderKey(key, shape) {
        this.pad.col(shape.pad, key);
        this.store();
    }

    render() { // renders the current internal state onto pad
        const arr = [];

        const grid = this.grid;
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                let keyState = grid[x][y];
                let shape = this.getShapeFromId(keyState.id);
                arr.push([x, y, shape.pad]);
            }

        }

        this.pad.setColors(arr);

        this.store();


    }




    // LAYERED RENDERING
    combineLayers(layers) { //[grid, grid, ...]
        let finalGrid = [
            [], [], [], [], [], [], [], [],
        ]

        for (let i = 0; i < layers.length; i++) {
            const grid = layers[i];
            this.loopGrid(grid, (data, x, y) => {
                if (data) {
                    finalGrid[x][y] = data;
                }
            })
        }


    }




    // helper
    loopGrid(grid, callback) {  // callback will be (data, x, y)
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                let data = grid[x][y];
                callback(data, x, y);
            }

        }
    }

    getPrefabGrid(value = null) { // value is optional
        let prefabGrid = [
            [], [], [], [], [], [], [], [],
        ]

        for (let x = 0; x <= 7; x++) {
            for (let y = 0; y <= 7; y++) {
                prefabGrid[x].push(value);
            }

        }

        return prefabGrid
    }





    // reset 

    reset() { // resets all states;
        // grid
        let grid = []
        for (let i = 0; i < 8; i++) {
            const row = [{ id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }]
            grid = [...grid, row]
        }
        this.grid = grid;


        this.storageAddress = null;

        this.render()





        // intervals
        this.INTERVAL_FUNCTIONS = {
            second: () => { },
            minute: () => { },
        }
    }




    // storage
    setStorageAddress(address) {
        this.storageAddress = address;
    }

    async store() {
        const address = this.storageAddress;
        if (!address) return;
        const data = JSON.stringify(this.grid);
        localStorage.setItem(address, data);
    }

    getStorage() {
        const address = this.storageAddress;
        if (!address) return null;
        const store = localStorage.getItem(address);
        if (!store) return null;
        const data = JSON.parse(store);
        return data;
    }

}


export default StateManager