type Rotation = 0 | 90 | 180 | 270;

class BoardHelper {
  rotation: Rotation;

  constructor(rotation: Rotation = 0) {
    this.rotation = rotation;
  }

  /**
   * Convert x,y coordinates (0-7) into Launchpad note address
   * @param x column 0-7
   * @param y row 0-7
   */
  getNote(x: number, y: number): number {
    x = Math.max(0, Math.min(7, x));
    y = Math.max(0, Math.min(7, y));

    let col = x;
    let row = y;

    // Apply rotation
    switch (this.rotation) {
      case 0:
        break;
      case 90:
        [col, row] = [7 - row, col];
        break;
      case 180:
        [col, row] = [7 - col, 7 - row];
        break;
      case 270:
        [col, row] = [row, 7 - col];
        break;
    }

    return row * 16 + col;
  }

  /**
   * Convert Launchpad note address back to x,y coordinates
   * @param note MIDI note address (0-127)
   * @returns x,y coordinates (0-7)
   */
  getCoords(note: number): { x: number; y: number } {
    // Calculate row and column for rotation 0
    let row = Math.floor(note / 16);
    let col = note % 16;

    // Only main 8x8 grid
    col = Math.min(col, 7);
    row = Math.min(row, 7);

    // Apply inverse rotation
    let x = col;
    let y = row;
    switch (this.rotation) {
      case 0:
        break;
      case 90:
        [x, y] = [y, 7 - x];
        break;
      case 180:
        [x, y] = [7 - col, 7 - row];
        break;
      case 270:
        [x, y] = [7 - y, col];
        break;
    }

    return { x, y };
  }
}
