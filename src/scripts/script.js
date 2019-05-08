let currentPlayer = 'white';
// gets the total size of the board, finds appropriate spacing
const boardElement = document.getElementById('goBoard-img');
const boardPositionInfo = boardElement.getBoundingClientRect();
const boardHeight = boardPositionInfo.height;
const boardWidth = boardPositionInfo.width;
const boardOffset = (22 / 400) * boardWidth; // calculation based on ratio
const spacing = (boardWidth - boardOffset) / 18;
const pieceSize = 15;
const pieceOffset = pieceSize / 2; // need to shift up by half the piece offset

// Create 2-D array to hold all values
var totalBoard = new Array(19);
for (i = 0; i < totalBoard.length; ++i) {
  totalBoard[i] = new Array(19);
}

// Toggles player
function togglePlayer() {
  currentPlayer = currentPlayer === 'white' ? (currentPlayer = 'black') : (currentPlayer = 'white');
}

function getPosition(e) {
  let x = e.clientX - boardPositionInfo.left;
  let y = e.clientY - boardPositionInfo.top;
  document.getElementById('objectCoords').innerHTML = 'Current coordinates:<br>' + x + ', ' + y;
  return { x, y };
}

// Implementation of placing the piece
function placePiece(e) {
  // gets location
  const location = getPosition(e);

  // creates piece and sets styles
  const piece = document.createElement('img');
  piece.className = 'piece';
  piece.style.width = pieceSize + 'px'; // todo: change to proportion
  piece.style.height = pieceSize + 'px';
  piece.style.position = 'absolute';

  // determines which player it is
  piece.src = currentPlayer === 'white' ? 'assets/white-piece.png' : 'assets/black-piece.png';

  const grid = getRowCol(location.x, location.y);

  // potential error here to load the board with the wrong player if they toggle really quick
  totalBoard[grid.row][grid.col] = currentPlayer;
  console.log('row: ' + grid.row);
  console.log('col: ' + grid.col);
  console.log('spacing:' + spacing);
  console.log(totalBoard[grid.row][grid.col]);
  const fixedXpos = grid.row * spacing + boardOffset / 2 - pieceOffset;
  const fixedYpos = grid.col * spacing + boardOffset / 2 - pieceOffset;
  console.log('boardOffset: ' + boardOffset);
  console.log('fixedX: ' + fixedXpos);

  console.log('fixedY: ' + fixedYpos);
  // insert custom ID here based on row and column

  // .custom {
  //   cursor: url(images/my-cursor.png), auto;
  // }

  // add logic that prevents
  piece.style.marginLeft = fixedXpos + 'px';
  piece.style.marginTop = fixedYpos + 'px';
  // piece.innerHTML = html;

  document.getElementById('goBoard').appendChild(piece);
}

function getRowCol(xpos, ypos) {
  // finds basic column and row
  let row = Math.round(xpos / spacing);
  let col = Math.round(ypos / spacing);
  return { row, col };
}

// Function for testing finding object coordinates
// document.getElementById('goBoard').onmousemove = findObjectCoords;
document.getElementById('goBoard').addEventListener('mousemove', getPosition);
document.getElementById('goBoard').addEventListener('click', placePiece);

// // Function that actually places the piece
// document.getElementById('goBoard-img').onclick = placePiece;

// FIXME: logic for piece placement
