const availableColors = [0, 3, 6, 9, 12];


class ColoringView {
    constructor(state, toolbar) {
        this.state = state;
        this.toolbar = toolbar;
        this.selected = {
            color: 0,
            brightnessSubtrahend: 0,
        }
    }

    mount() {
        this.state.setGrid(this.state.getPrefabGrid({ id: 0, onClick: (data) => this.onClick(data) })) // fills grid with clickable keys
        this.toolbar.setToolbar(this.getToolbar())
    }

    onSecondInterval() {

    }

    onMinuteInterval() {

    }

    onClick(key) { // key = coordinates, down, up && shape
        if (key.down) {
            const { color, brightnessSubtrahend } = this.selected;
            const buttonColor = (color === 0 ? 0 : color - brightnessSubtrahend);
            key.setId(buttonColor);
        }
    }

    onToolbarClick(key) {

    }


    // code here



    getToolbar() {
        const { color, brightnessSubtrahend } = this.selected;

        let toolbar = [];


        // COLOR MENU
        let colorMenuOrder = [3, 6, 9, 12];

        if (color === 0) {
            toolbar = colorMenuOrder.map(c => ({ id: (c - 2), onClick: (key) => this.setSelectedColor(key, c) }));
        } else {
            for (const c of colorMenuOrder) {
                if (c === color) toolbar = [...toolbar, { id: color, onClick: (key) => this.setSelectedColor(key, 0) }];
                else toolbar = [...toolbar, { id: (c - 2), onClick: (key) => this.setSelectedColor(key, c) }];
            }
        }

        toolbar = [...toolbar, { id: 0, onClick: (key) => this.fillGridWithColor(key) }];




        // BRIGHTNESS MENU
        let buttonColor = color - brightnessSubtrahend;
        let brightness = 3 - brightnessSubtrahend;

        for (let i = 1; i <= 3; i++) {
            toolbar = [...toolbar, {
                id: (i <= brightness ? buttonColor : 0),
                onClick: (key) => this.setSelectedBrightness(key, (2 - (i - 1)))
            }]
        }


        return toolbar

    }



    setSelectedColor(key, color) {
        if (key.up) return;
        this.selected.color = color;
        this.toolbar.setToolbar(this.getToolbar())
    }


    setSelectedBrightness(key, brightnessSubtrahend) {
        if (key.up) return;
        this.selected.brightnessSubtrahend = brightnessSubtrahend;
        this.toolbar.setToolbar(this.getToolbar())
    }



    fillGridWithColor(key) {
        if (key.up) return;
        const { color, brightnessSubtrahend } = this.selected;
        const buttonColor = (color === 0 ? 0 : color - brightnessSubtrahend);
        this.state.setGrid(this.state.getPrefabGrid({ id: buttonColor, onClick: (data) => this.onClick(data) }))
    }

}



function getNextShapeId(currentId) {
    const index = shapeOrder.indexOf(currentId) || 0;
    let newIndex = index + 1;
    if (index >= shapeOrder.length - 1) newIndex = 0;
    return shapeOrder[newIndex];
}



export default ColoringView