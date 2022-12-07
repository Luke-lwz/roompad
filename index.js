import Launchpad from "launchpad-mini";

import fetch from "node-fetch";
import PressedInView, { PressedInToolbar } from "./src/helpers/PressedHelper.js";

import StateManager from "./src/helpers/StateManager.js";
import ToolbarStateManager from "./src/helpers/ToolbarStateManager.js";

// views 
import ClockView from "./src/views/clock/index.js";
import ColoringView from "./src/views/coloring/index.js";




const VIEWS = [
    {
        route: "/clock",
        view: ClockView
    },
    {
        route: "/coloring",
        view: ColoringView
    },
]


let currentRoute = "/clock";


const pad = new Launchpad();
const state = new StateManager(pad);
const toolbar = new ToolbarStateManager(pad);
pad.connect().then(() => {

    // INIT
    loadView();



    //  EVENTS
    pad.on('key', k => {
        // Make button red while pressed, green after pressing
        PressedInView(k, (key) => {
            state.onClick(key);

        })

        PressedInToolbar(k, (key) => {
            toolbar.onClick(key);
        })
    });







    // Routing
    function changeRoute(newRoute) {
        if (!getViewData(newRoute)) return
        currentRoute = newRoute;
        loadView();
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


});




function launch(pad, view) {
    pad.reset(0);
    view(pad);
}

