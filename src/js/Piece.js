// creation of a piece
export default class Piece {
  // basic constructor
  constructor(color, row, col) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.visited = false;
    this.pieceSize = 15;
    this.createPieceElement(); // creates pieceEl as the doc el
  }

  createPieceElement() {
    this.pieceEl = document.createElement('img');
    this.pieceEl.className = 'piece';
    this.pieceEl.src = this.color === 'white' ? 'assets/white-piece.png' : 'assets/black-piece.png';
    this.generatePieceID(); // creates pieceID
    this.pieceEl.id = this.pieceID;
  }

  generatePieceID() {
    this.pieceID = this.color.charAt(0);
    this.pieceID += this.row < 10 ? `0${this.row}` : this.row;
    this.pieceID += this.col < 10 ? `0${this.col}` : this.col;
  }
}
