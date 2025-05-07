import Launchpad from "launchpad-mini";

// Librarys
import fetch from "node-fetch";
import { OpenWeatherAPI } from "openweather-api-node";



import PressedInView, { PressedInToolbar, PressedInNavbar } from "./src/helpers/PressedHelper.js";


import getHueClient from "./src/smarthome/hue.js";

import StateManager from "./src/helpers/StateManager.js";
import ToolbarStateManager from "./src/helpers/ToolbarStateManager.js";
import NavbarStateManager from "./src/helpers/NavbarStateManager.js";

// views 
import ClockView from "./src/views/clock/index.js";
import TemperatureView from "./src/views/temperature/index.js";
import ColoringView from "./src/views/coloring/index.js";

// game vies
import TicTacToeGameView from "./src/views/games/tictactoe/index.js";


// let weather = new OpenWeatherAPI({
//     key: "a6c589533af628dfe5aee1aa0a216021",
//     units: "metric"
// })

// weather.setLocationByCoordinates(49, 8)

const VIEWS = [
    {
        route: "/clock",
        view: ClockView
    },
    // {
    //     route: "/temperature",
    //     view: TemperatureView,
    // },
    {
        route: "/coloring",
        view: ColoringView,
        settings: { // overwrites any settings and will apply while view is active (afterwards will revert back to original)
            nightmode: false,
        }
    },

    // {
    //     route: "/games/tictactoe",
    //     view: TicTacToeGameView
    // },
]


const NAV = [
    {
        name: "Clock",
        route: "/clock"
    },
    // {
    //     name: "Temperature",
    //     route: "/temperature"
    // },
    {
        name: "Coloring",
        route: "/coloring"
    },
    // {
    //     name: "Tic Tac Toe",
    //     route: "/games/tictactoe"
    // },
]


let currentRoute = "/clock";


const util = {
    hue: null,
    weather: null,
}


const originalSettings = {
    nightmode: false,
    nightmodestart: 22,
    nightmodeend: 7
}

let revertSettings = JSON.parse(JSON.stringify(originalSettings));

let settings = JSON.parse(JSON.stringify(originalSettings));




const pad = new Launchpad();
const state = new StateManager(pad, settings);
const toolbar = new ToolbarStateManager(pad, settings);
const navbar = new NavbarStateManager(pad, settings);




const func = { // functions for views to cummunicate with outside
    toggleNightMode: (forceState) => {
        let nightmode = (forceState ? forceState : !settings.nightmode)

        func.applySettings({ nightmode });

        return nightmode;
    },
    applySettings: (overwrites) => { // applies settings
        if (overwrites) {
            for (const setting in overwrites) {
                if (Object.hasOwnProperty.call(overwrites, setting)) {
                    const element = overwrites[setting];
                    settings[setting] = element;
                    revertSettings[setting] = element;
                }
            }
        } else {
            for (const setting in revertSettings) {
                if (Object.hasOwnProperty.call(revertSettings, setting)) {
                    const element = revertSettings[setting];
                    settings[setting] = element;
                }
            }
            revertSettings = settings;
        }

        state.render();
        toolbar.render();
        navbar.render();
    },
    applyTempSettings: (overwrites) => { // will apply settings temporarily, until this function or func.applySettings(undefined) is called again
        if (overwrites) {
            for (const setting in overwrites) {
                if (Object.hasOwnProperty.call(overwrites, setting)) {
                    const element = overwrites[setting];
                    settings[setting] = element;
                }
            }
        } else {
            for (const setting in revertSettings) {
                if (Object.hasOwnProperty.call(revertSettings, setting)) {
                    const element = revertSettings[setting];
                    settings[setting] = element;
                }
            }
        }

        state.render();
        toolbar.render();
        navbar.render();
    }
}







async function main() {
    searchPadMode()
    // loadHue();

    // Intervals 
    let currentIntervalHour = null;
    setInterval(() => { // nightmode interval
        let date = new Date();
        let h = date.getHours();

        if (h !== currentIntervalHour) {
            currentIntervalHour = h;
            if (h === settings.nightmodestart) func.toggleNightMode(true);
            else if (h === settings.nightmodeend) func.toggleNightMode(false);
        }


    }, 1 * 1000)




    // Weather
    // getWeather();
    // setInterval(() => getWeather(), 5 * 60 * 1000);

    function getWeather() {
        weather.getCurrent().then(data => {
            console.log(`Current temperature in New York is: ${data.weather.temp.cur}\u00B0F`)
        })
    }



}
main();




pad.on('key', k => {

    // Make button red while pressed, green after pressing
    PressedInView(k, (key) => {
        // if (key.down) console.log(k.x, k.y)
        state.onClick(key);


    })

    PressedInToolbar(k, (key) => {
        toolbar.onClick(key);
    })

    PressedInNavbar(k, (key) => {
        if (key.down) return;
        navbar.onClick(key);
    })
});



async function launch() {

    pad.connect().then(() => {
        // INIT
        loadView();
        loadNavbar();

        const interval = setInterval(() => { // checks if no board connected and goes into searchPadMode mode
            const ports = pad.availablePorts;
            if (ports?.input?.length <= 0 || ports?.output?.length <= 0) {
                clearInterval(interval)
                pad.disconnect()
                searchPadMode();
            };
        }, 2 * 1000)




        //  EVENTS






        // Navigation
        function loadNavbar() {
            let arr = [];
            for (let i = 0; i < 8; i++) {
                const element = NAV[i];
                if (element) { // if element enter in navbar
                    arr = [{
                        id: (currentRoute === element.route ? 12 : 3),
                        onClick: () => changeRoute(element.route)
                    }, ...arr];
                } else { // if no element, enter null
                    arr = [null, ...arr]
                }
            }

            navbar.setNavbar(arr);
        }



        // Routing
        function changeRoute(newRoute) {
            if (!getViewData(newRoute)) return
            currentRoute = newRoute;
            loadView();
            loadNavbar();
        }


        function loadView() {
            state.reset();
            toolbar.reset();

            const viewData = getViewData(currentRoute);


            func.applyTempSettings(viewData?.settings);


            const view = new viewData.view(state, toolbar, settings, func, util);

            view.mount();


        }

        function getViewData(route) {
            return VIEWS.filter(v => v.route === route)[0] || null;
        }


    }).catch(() => {
        const timeout = setTimeout(() => {
            launch()
            clearTimeout(timeout)
        }, 20 * 1000)
    })
}


function searchPadMode() {
    const interval = setInterval(() => {
        const ports = pad.availablePorts;
        if (ports?.input?.length > 0 && ports?.output?.length > 0) {
            launch()
            clearInterval(interval)
        };

    }, 1 * 1000)
}




function loadHue() {
    const interval = setInterval(() => {
        loadHueClient(interval);
    }, 10 * 1000)


}

async function loadHueClient(interval) {
    let client = await getHueClient();
    if (client && !util.hue) {
        clearInterval(interval);
        return util.hue = client;
    }
}









