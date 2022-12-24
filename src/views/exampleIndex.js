class ExampleView {
    constructor(state, toolbar, settings, func, util) { // params is filled with optional parameters like hue
        this.state = state;
        this.toolbar = toolbar;
        this.settings = settings;
        this.func = func;
        this.util = util;
    }

    mount() {
        this.asyncMount();
        this.state.setGrid(this.state.getPrefabGrid({ id: 0, onClick: (data) => this.onClick(data) })) // fills grid with clickable keys
        this.toolbar.setToolbar(this.toolbar.getPrefabToolbar({ id: 0, onClick: (data) => this.onToolbarClick(data) })) // fills toolbar with clickable keys
        this.state.setIntervalFunction("second", () => this.onSecondInterval())
        this.state.setIntervalFunction("minute", () => this.onMinuteInterval())
    }

    async asyncMount() {

    }

    onSecondInterval() {

    }

    onMinuteInterval() {

    }

    onClick(key) { // key = coordinates, down, up && shape

    }

    onToolbarClick(key) { // key = coordinates, down, up && shape

    }

    // code


}

export default ExampleView