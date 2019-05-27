// creation of a piece
export default class Piece {
  /**
   * basic constructor that takes in color, row, and column
   * @param {String} color – the color of the piece
   * @param {Number} row – the row of the piece
   * @param {Number} col – the column of the piece
   */
  constructor(color, row, col) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.pieceSize = 15;
    this.createPieceElement(); // creates pieceEl as the doc el
    // this.visited = false;
  }

  /**
   * creates the piece that will be placed on the board itself, and generates
   * a unique ID for the piece element
   */
  createPieceElement() {
    this.pieceEl = document.createElement('img');
    this.pieceEl.className = 'piece';
    this.pieceEl.src = this.color === 'white' ? 'assets/white-piece.png' : 'assets/black-piece.png';
    this.generatePieceID(); // creates pieceID
    this.pieceEl.id = this.pieceID;
  }

  /**
   * creates a unique identifier based on row and column to more easily remove pieces
   */
  generatePieceID() {
    this.pieceID = this.color.charAt(0);
    this.pieceID += this.row < 10 ? `0${this.row}` : this.row;
    this.pieceID += this.col < 10 ? `0${this.col}` : this.col;
  }

  /**
   * function that removes this piece from the document
   */
  removePiece() {
    document.getElementById(this.pieceID).remove();
  }
}
