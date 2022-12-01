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
        this.toolbar.setGrid(this.toolbar.getPrefabToolbar()) // fills toolbar with clickable keys
    }

    onSecondInterval() {

    }

    onMinuteInterval() {

    }

    onClick(key) { // key = coordinates, down, up && shape
        const { shape } = key;
        if (key.down) {
            let currentId = shape.id;
            const nextId = getNextShapeId(currentId);
            key.setId(nextId);
        }
    }

    onToolbarClick(key) {

    }


    // code here



    getToolbar() {
        const { color, brightnessSubtrahend } = this.selected;
        // load toolbar here
    }

}



function getNextShapeId(currentId) {
    const index = shapeOrder.indexOf(currentId) || 0;
    let newIndex = index + 1;
    if (index >= shapeOrder.length - 1) newIndex = 0;
    return shapeOrder[newIndex];
}



export default ColoringView