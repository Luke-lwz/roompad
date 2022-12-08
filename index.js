import Launchpad from "launchpad-mini";

import fetch from "node-fetch";
import PressedInView, { PressedInToolbar, PressedInNavbar } from "./src/helpers/PressedHelper.js";

import StateManager from "./src/helpers/StateManager.js";
import ToolbarStateManager from "./src/helpers/ToolbarStateManager.js";
import NavbarStateManager from "./src/helpers/NavbarStateManager.js";

// views 



import ClockView from "./src/views/clock/index.js";
import ColoringView from "./src/views/coloring/index.js";

// game vies
import TicTacToeGameView from "./src/views/games/tictactoe/index.js";






const VIEWS = [
    {
        route: "/clock",
        view: ClockView
    },
    {
        route: "/coloring",
        view: ColoringView
    },

    {
        route: "/games/tictactoe",
        view: TicTacToeGameView
    },
]


const NAV = [
    {
        name: "Clock",
        route: "/clock"
    },
    {
        name: "Coloring",
        route: "/coloring"
    },
    {
        name: "Tic Tac Toe",
        route: "/games/tictactoe"
    },
]


let currentRoute = "/clock";


const pad = new Launchpad();
const state = new StateManager(pad);
const toolbar = new ToolbarStateManager(pad);
const navbar = new NavbarStateManager(pad);



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


            const view = new viewData.view(state, toolbar);

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





searchPadMode()

