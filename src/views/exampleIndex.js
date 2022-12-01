class ExampleView {
    constructor(state, toolbar) {
        this.state = state;
        this.toolbar = toolbar;
    }

    mount() {
        this.state.setGrid(this.state.getPrefabGrid({ id: 0, onClick: (data) => this.onClick(data) })) // fills grid with clickable keys
        this.toolbar.setGrid(this.toolbar.getPrefabToolbar({ id: 0, onClick: (data) => this.onToolbarClick(data) })) // fills toolbar with clickable keys
    }

    onSecondInterval() {

    }

    onMinuteInterval() {

    }

    onClick(key) { // key = coordinates, down, up && shape

    }

    onToolbarClick(key) { // key = coordinates, down, up && shape

    }
}

export default ExampleView