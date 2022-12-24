import { getPrefabGrid, loopGrid } from "../../../helpers/layers.js";


const FIELDGRIDUNIFIER = [ // give x and y and return a and b
    {
        fieldCoors: { "0": 2, "1": 0, a: 2, b: 0 },
        gridCoors: [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1]
        ]
    },
    {
        fieldCoors: { "0": 2, "1": 1, a: 2, b: 1 },
        gridCoors: [
            [0, 4],
            [0, 3],
            [1, 3],
            [1, 4]
        ]
    },
    {
        fieldCoors: { "0": 2, "1": 2, a: 2, b: 2 },
        gridCoors: [
            [0, 6],
            [0, 7],
            [1, 6],
            [1, 7]
        ]
    },

    {
        fieldCoors: { "0": 1, "1": 0, a: 1, b: 0 },
        gridCoors: [
            [3, 0],
            [4, 0],
            [3, 1],
            [4, 1]
        ]
    },
    {
        fieldCoors: { "0": 1, "1": 1, a: 1, b: 1 },
        gridCoors: [
            [4, 4],
            [4, 3],
            [3, 3],
            [3, 4]
        ]
    },
    {
        fieldCoors: { "0": 1, "1": 2, a: 1, b: 2 },
        gridCoors: [
            [3, 6],
            [4, 7],
            [4, 6],
            [3, 7]
        ]
    },

    {
        fieldCoors: { "0": 0, "1": 0, a: 0, b: 0 },
        gridCoors: [
            [6, 0],
            [7, 0],
            [6, 1],
            [7, 1]
        ]
    },
    {
        fieldCoors: { "0": 0, "1": 1, a: 0, b: 1 },
        gridCoors: [
            [7, 4],
            [7, 3],
            [6, 3],
            [6, 4]
        ]
    },
    {
        fieldCoors: { "0": 0, "1": 2, a: 0, b: 2 },
        gridCoors: [
            [6, 6],
            [6, 7],
            [7, 6],
            [7, 7]
        ]
    },
]







class TicTacToeGameView {
    constructor(state, toolbar) {
        this.state = state;
        this.toolbar = toolbar;

        this.gameStage = "start"; // "start" / "end"

        this.currentPlayer = 1;

        this.fieldHistory = [ // a row and b row instead of x and y because x and y is used in grid
            [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
        ]
    }

    mount() {
        this.loadGrid()
        this.loadToolbar();
    }

    onSecondInterval() {

    }

    onMinuteInterval() {

    }

    onClick(key) { // key = coordinates, down, up && shape
        if (key.up) return
        const tile = getFieldCoor(key.x, key.y);

        console.log(tile)

        const field = this.getCurrentField();
        if (field[tile.a][tile.b] === 0) {
            field[tile.a][tile.b] = this.currentPlayer;
            this.switchPlayer()

            this.fieldHistory.push(field);
            this.loadGrid();
            this.loadToolbar();


            this.checkEnd();
        }


    }

    onToolbarClick(key) { // key = coordinates, down, up && shape
        if (key.up || this.gameStage === "end") return;
        if (this.fieldHistory.length > 1) this.fieldHistory.pop();
        this.switchPlayer()
        this.loadGrid()
        this.loadToolbar();
    }

    // code

    switchPlayer() {
        if (this.currentPlayer === 1) this.currentPlayer = 2;
        else if (this.currentPlayer === 2) this.currentPlayer = 1;
    }

    loadGrid() {


        let newGrid = getPrefabGrid();

        loopGrid(newGrid, (data, x, y) => {
            const tile = getFieldCoor(x, y);
            console.log(tile)
            if (tile) {
                let value = this.getShapeOfTile(tile);
                newGrid[x][y] = value;
            } else newGrid[x][y] = { id: 6 };
        })




        this.state.setGrid(newGrid);



    }

    loadToolbar() {
        let arr = [];
        let shape = {
            id: (this.currentPlayer === 1 ? 2 : 10),
            onClick: (key) => this.onToolbarClick(key)
        }
        for (let i = 0; i < 8; i++) {
            arr.push(shape);
        }
        this.toolbar.setToolbar(arr);
    }


    getShapeOfTile(tile) {
        const tileData = {
            "0": {
                id: 0,
                onClick: (key) => this.onClick(key)
            },
            "1": {
                id: 3
            },
            "2": {
                id: 12
            }
        }

        const field = this.getCurrentField();

        const value = field[tile.a][tile.b];

        return tileData[value];
    }

    getCurrentField() {
        return JSON.parse(JSON.stringify(this.fieldHistory[this.fieldHistory?.length - 1]));
    }



    checkEnd() {

    }


    winCheck() {
        let winner = null;
        let tiles = []

        const field = this.getCurrentField();


        for (let playerNr = 1; playerNr <= 2; playerNr++) {
            // checking diagonals
            if (field[0][0] === playerNr && field[1][1] === playerNr && field[2][2] === playerNr) {
                winner = playerNr;
                tiles = [{ a: 0, b: 0 }, { a: 1, b: 1 }, { a: 2, b: 2 }]
            }
            if (field[2][0] === playerNr && field[2][2] === playerNr && field[0][2] === playerNr) {
                winner = playerNr;
                tiles = [{ a: 2, b: 0 }, { a: 1, b: 1 }, { a: 0, b: 2 }]
            }

            let matchingTiles = [];

            for (let axis = 0; axis <= 1; axis++) { // for loop to handle axis change

                for (let i = 0; i <= 2; i++) {


                    for (let j = 0; j <= 2; j++) {

                        let tile = (axis == 1 ? { a: i, b: j } : { a: i, b: j });
                        if (field[tile.a][tile.b] === playerNr) matchingTiles.push(tile);

                    }


                    if (matchingTiles.length >= 3) {
                        winner = playerNr
                        tiles = matchingTiles
                        return
                    }

                    matchingTiles = [];

                }
            }


            if (!winner) return null;
            else return { winner, tiles };





        }
    }



}



function getFieldCoor(x, y) {// returns field coordinates a, b or null
    const fieldgridunit = FIELDGRIDUNIFIER.filter(e => {
        if (e.gridCoors.filter(c => (c[0] === x && c[1] === y))[0]) return true;
        return false;
    })?.[0];


    return fieldgridunit?.fieldCoors || null;

}


export default TicTacToeGameView