import { getPrefabGrid, margin } from "../helpers/layers.js"

// components 
import MiniNumber from "./MiniNumber.js"


function DegreeDisplay(degrees = "0") {
    let minus = false;
    if (degrees.startsWith("-")) minus = true;

    

    return margin(MiniNumber("3", 3))
}

export default DegreeDisplay;