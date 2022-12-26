import { getPrefabGrid, margin, flattenLayers } from "../helpers/layers.js"

// components 
import MiniNumber from "./MiniNumber.js"

const minusComponent = [
    [null, null],
    [12, 12],
]

const degreeDotComponent = [
    [6, 6],
    [6, 6],
]


function DegreeDisplay(degrees = "0") {
    if (typeof degrees !== 'string') return getPrefabGrid();
    let minus = false;
    if (degrees.startsWith("-")) {
        minus = true;
        degrees = degrees.replace("-", "")
    };

    let degreeArray = degrees.split("");


    let grid = getPrefabGrid()

    let x = 2; // margin for allnumbers




    let layers = [];




    if (degreeArray.length === 1) {
        let nr = degreeArray[0];
        let nrgrid = MiniNumber(nr, 6);


        layers = [
            ...layers,
            margin(nrgrid, {
                x,
                y: (minus ? 3 : 0)
            })
        ];


        if (minus) layers = [...layers, margin(minusComponent, { x, y: 1 })];
        else layers = [...layers, margin(degreeDotComponent, { x, y: 5 })];



    } else if (degreeArray.length === 2) {
        let nr1 = degreeArray[0];
        let nr2 = degreeArray[1];
        let nrgrid1 = MiniNumber(nr1, 6);
        let nrgrid2 = MiniNumber(nr2, 9);

        let numbersGrid = flattenLayers([ // pushes 2nd number 3 tiles to right
            margin(nrgrid1),
            margin(nrgrid2, { y: 3 }),
        ])


        layers = [
            ...layers,
            margin(numbersGrid, {
                x,
                y: (minus ? 1 : -1)
            })
        ];

        if (minus) layers = [...layers, margin(minusComponent, { x })];
        else layers = [...layers, margin([[9]], { x, y: 7 })];


    }



    grid = flattenLayers([
        grid,
        ...layers
    ])




    return grid;


}

export default DegreeDisplay;