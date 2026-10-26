const PALETTE = [
  '#ff6b6b', '#ff9f43', '#ffd166', '#06d6a0',
  '#4ecdc4', '#45aaf2', '#5f6caf', '#a78bfa',
  '#f06595', '#f78fb3', '#b8e986', '#f4a261',
];

function randomColor() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

/**
 * Model: estado e regras do jogo, sem dependência de DOM ou plataforma.
 */
export class GameModel {
  constructor({ columns = 30, rows = 30 } = {}) {
    this.columns = columns;
    this.rows = rows;
    this.placedBlocks = new Map();
    this.hoveredCell = null;
    this.nextColor = randomColor();
  }

  setHoveredCell(cell) {
    this.hoveredCell = cell;
  }

  placeBlock(cell) {
    if (!cell || cell.col < 0 || cell.col >= this.columns || cell.row < 0 || cell.row >= this.rows) {
      return false;
    }

    const key = this.cellKey(cell.col, cell.row);
    if (this.placedBlocks.has(key)) return false;

    this.placedBlocks.set(key, {
      col: cell.col,
      row: cell.row,
      color: this.nextColor,
    });
    this.nextColor = randomColor();
    return true;
  }

  cellKey(col, row) {
    return `${col}:${row}`;
  }

  getState() {
    return {
      columns: this.columns,
      rows: this.rows,
      blocks: [...this.placedBlocks.values()],
      hoveredCell: this.hoveredCell,
      nextColor: this.nextColor,
      placedCount: this.placedBlocks.size,
    };
  }
}
