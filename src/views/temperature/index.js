import weather from "weather-js";

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
        weather.find({ search: 'Landau in der Pfalz, Germany', degreeType: 'C' }, (err, result) => {
            if (err) return

            console.log(result);


            this.state.setGrid(DegreeDisplay())
        });
    }

}

export default TemperatureView