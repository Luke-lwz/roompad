export function loopGrid(grid, callback) {  // callback will be (data, x, y)
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            let data = grid[x][y];
            callback(data, x, y);
        }

    }
}



export function flattenLayers(layers) { //[grid, grid, ...]
    let finalGrid = getPrefabGrid()

    for (let i = 0; i < layers.length; i++) {
        let grid = layers[i];
        loopGrid(grid, (data, x, y) => {
            if (data && data !== null) {
                finalGrid[x][y] = data;
            }
        })
    }


    return finalGrid;

}


export function margin(component, m = {}) {
    if (!m.x) m.x = 0;
    if (!m.y) m.y = 0;
    let grid = getPrefabGrid();

    loopGrid(grid, (data, a, b) => {
        const j = a - m.x,
            k = b - m.y; // moved coordinates

        let componentData = component?.[j]?.[k];
        if (j >= 0 && k >= 0 && componentData) {
            grid[a][b] = componentData;
        }
    })

    return grid;
}


export function getPrefabGrid(value = null) { // value is optional
    let prefabGrid = [
        [], [], [], [], [], [], [], [],
    ]

    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            prefabGrid[x].push(value);
        }

    }

    return prefabGrid
}