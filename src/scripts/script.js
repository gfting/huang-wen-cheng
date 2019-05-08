let currentPlayer = 'white';
// gets the total size of the board, finds appropriate spacing
const boardElement = document.getElementById('goBoard-img');
const boardPositionInfo = boardElement.getBoundingClientRect();
const boardHeight = boardPositionInfo.height;
const boardWidth = boardPositionInfo.width;
const boardOffset = (24 / 400) * boardWidth;
const spacing = (boardWidth - boardOffset) / 20;

// Create 2-D array to hold all values
var totalBoard = new Array(20);
for (i = 0; i < totalBoard.length; ++i) {
  totalBoard[i] = new Array(20);
}

// Toggles player
function togglePlayer() {
  currentPlayer = currentPlayer === 'white' ? (currentPlayer = 'black') : (currentPlayer = 'white');
}

function getPosition(e) {
  console.log(e.clientX);
  console.log(e.clientY);
  let x = e.clientX - boardPositionInfo.left;
  let y = e.clientY - boardPositionInfo.top;
  document.getElementById('objectCoords').innerHTML = 'Current coordinates:<br>' + x + ', ' + y;
  return {
    x,
    y
  };
}

// Implementation of placing the piece
function placePiece(e) {
  // gets location
  const location = getPosition(e);

  // creates piece and sets styles
  const piece = document.createElement('img');
  piece.className = 'piece';
  piece.style.width = '15px'; // todo: change to proportion
  piece.style.height = '15px';
  piece.style.position = 'absolute';

  // determines which player it is
  piece.src = currentPlayer === 'white' ? 'assets/white-piece.png' : 'assets/black-piece.png';

  const grid = getRowCol(location.x, location.y);

  // potential error here to load the board with the wrong player if they toggle really quick
  totalBoard[grid.row][grid.col] = currentPlayer;
  console.log(grid.row);
  console.log(grid.col);
  console.log(totalBoard[grid.row][grid.col]);
  const fixedXpos = grid.row * spacing + boardOffset;
  const fixedYpos = grid.col * spacing + boardOffset;
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
