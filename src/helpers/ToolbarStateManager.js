

class ToolbarStateManager {
    constructor(pad) {
        this.pad = pad;
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

        this.toolbar = [{ id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }];



    }


    // EVENTS
    onClick(k) {
        const state = this.getKey(k);
        if (state?.onClick) {
            let shape = this.getShapeFromId(state?.id);
            state.onClick({ ...k, shape, set: () => this.setKey(k, id), setId: (id) => this.setKeyId(k, id) });
        }
    }


    // SET
    setToolbar(toolbar) { // 1 dimensional array of exact length 8  // data can be either: obj = {id: 3, onClick: () => {}} || just an integer with the id;
        if (!toolbar) return;
        let newToolbar = []

        for (let y = 0; y <= 7; y++) {
            let data = toolbar[y];
            if (data) {
                if (typeof (data) === "number") data = { id: data };
                newToolbar[y] = { id: data.id, onClick: data.onClick };
            } else { // if no data exists then render "off"
                newToolbar[y] = { id: this.shapes[0].id };
            }
        }


        this.toolbar = newToolbar;

        this.render();
    }



    setKey(key, data) { // data can be either: obj = {id: 3, onClick: () => {}} || just an integer with the id;
        if (!key || !data) return

        if (typeof (data) === "number") data = { id: data };

        const shape = this.getShapeFromId(data.id);

        // set in state 
        this.toolbar[key.y] = { id: shape.id, onClick: data.onClick };


        this.renderKey(key, shape)

    }


    setKeyId(key, id) { // only changes id not onClick function
        if (!key || !key) return

        const shape = this.getShapeFromId(id);

        // set in state 
        const keyState = this.getKey(key);
        this.toolbar[key.y] = { id, onClick: keyState.onClick };


        this.renderKey(key, shape)
    }








    // GET


    getShapeFromId(id) {
        return this.shapes[id] || this.shapes[0];
    }


    getShapeFromColors(color, brightness = 3) {
        return this.shapes.filter(e => (e.color === color && e.brightness === brightness))?.[0] || this.shapes[0];
    }




    getKey(key) { //
        const keyState = this.toolbar[key.y]
        const shape = this.getShapeFromId(keyState?.id);
        return { ...keyState, shape };
    };






    // Rendering 

    renderKey(key, shape) {
        this.pad.col(shape.pad, key);
    }

    render() { // renders the current internal state onto pad
        const arr = [];

        const toolbar = this.toolbar;
        for (let y = 0; y < toolbar.length; y++) {
            let keyState = toolbar[y];
            let shape = this.getShapeFromId(keyState.id);
            arr.push([8, y, shape.pad]);


        }

        this.pad.setColors(arr);
    }







    // helper
    getPrefabToolbar(value = null) { // value is optional
        let prefabToolbar = []

        for (let y = 0; y <= 7; y++) {
            prefabToolbar.push(value);
        }



        return prefabToolbar;
    }







    // reset 

    reset() { // resets all states;
        this.toolbar = [{ id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }];

        this.render()

    }
}


export default ToolbarStateManager