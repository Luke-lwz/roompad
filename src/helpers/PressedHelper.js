//Modifies pressed data and removes Nav (Round) buttons


function PressedInView(k, callback) {
    if (k.x >= 8 || k.y >= 8) return
    k.down = k.pressed;
    k.up = !k.pressed;
    return callback(k)
}

export function PressedInToolbar(k, callback) {
    if (k.x < 8 || k.y >= 8) return
    k.down = k.pressed;
    k.up = !k.pressed;
    return callback(k)
}


export default PressedInView