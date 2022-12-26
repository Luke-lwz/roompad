

//Components
import DegreeDisplay from "../../components/DegreeDisplay.js";

class TemperatureView {
    constructor(state, toolbar, settings, func, util) { // params is filled with optional parameters like hue
        this.state = state;
        this.toolbar = toolbar;
        this.settings = settings;
        this.func = func;
        this.util = util;
    }

    mount() {
        this.asyncMount();
        this.state.setIntervalFunction("minute", () => this.onMinuteInterval())

        this.temperature()
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


    temperature() {
        const { weather } = this.util;
        if (!weather?.current?.temperature) return

        const temp = weather.current.temperature;


        this.state.setGrid(DegreeDisplay(temp));
    }

}

export default TemperatureView