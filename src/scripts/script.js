// Starts off the game with player
let currentPlayer = 'white';

// gets the total size of the board, finds appropriate spacing
const goBoardDiv = document.getElementById('goBoard');
const boardElementImg = document.getElementById('goBoard-img');
const boardPositionInfo = boardElementImg.getBoundingClientRect();
const boardHeight = boardPositionInfo.height;
const boardWidth = boardPositionInfo.width;
const boardOffset = (22 / 400) * boardWidth; // calculation based on ratio
const numLines = 19;
const spacing = (boardWidth - boardOffset) / (numLines - 1);
const pieceSize = 15;
const pieceOffset = pieceSize / 2; // need to shift up by half the piece offset

// Create 2-D array to hold all values
var totalBoard = new Array(numLines);
for (i = 0; i < totalBoard.length; ++i) {
  totalBoard[i] = new Array(numLines);
}

// Toggles player
function togglePlayer() {
  currentPlayer = currentPlayer === 'white' ? (currentPlayer = 'black') : (currentPlayer = 'white');
}

// returns x and y position within current element
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
  piece.style.width = pieceSize + 'px';
  piece.style.height = pieceSize + 'px';
  piece.style.position = 'absolute';

  // determines which player it is
  piece.src = currentPlayer === 'white' ? 'assets/white-piece.png' : 'assets/black-piece.png';

  // grabs row and column information based on current coords
  const grid = getRowCol(location.x, location.y);
  const row = grid.row;
  const col = grid.col;
  // Basic prevention of duplicate pieces
  if (totalBoard[row][col]) {
    // TODO: Add some other kind of logic here
    console.log("There's a piece here already!");
  } else {
    // FIXME: Logic should go here to determine what gets placed
    // calculates position on the board based on row and col
    const fixedXpos = row * spacing + boardOffset / 2 - pieceOffset;
    const fixedYpos = col * spacing + boardOffset / 2 - pieceOffset;

    // loads into the array
    totalBoard[row][col] = currentPlayer;

    // generates a custom ID for this piece; needs to have trailing zeroes
    piece.id = generatePieceID(row, col);

    // logging information
    console.log(piece.id);
    console.log('row: ' + row);
    console.log('col: ' + col);
    console.log('spacing:' + spacing);
    console.log(totalBoard[row][col]);
    console.log('boardOffset: ' + boardOffset);
    console.log('fixedX: ' + fixedXpos);
    console.log('fixedY: ' + fixedYpos);

    piece.style.marginLeft = fixedXpos + 'px';
    piece.style.marginTop = fixedYpos + 'px';
    // piece.innerHTML = html;

    goBoardDiv.appendChild(piece);
  }

  // Future styling for custom hover icon
  // .custom {
  //   cursor: url(images/my-cursor.png), auto;
  // }
}

function getRowCol(xpos, ypos) {
  // finds basic column and row
  let row = Math.round((xpos - boardOffset / 2) / spacing);
  let col = Math.round((ypos - boardOffset / 2) / spacing);
  return { row, col };
}

function generatePieceID(row, col) {
  let pieceID = totalBoard[row][col][0];
  pieceID += row < 10 ? '0' + row : row;
  pieceID += col < 10 ? '0' + col : col;
  return pieceID;
}

// removes a single piece based on its ID
function removeByID(pieceID) {
  document.getElementById(pieceID).remove();
}

// gets row and column out of a pieceID through simple ternary operators
function extractRowCol(pieceID) {
  let row = pieceID[1] === '0' ? pieceID[2] : pieceID[1] + pieceID[2];
  let col = pieceID[3] === '0' ? pieceID[4] : pieceID[3] + pieceID[4];
  row = parseInt(row);
  col = parseInt(col);
  return { row, col };
}

// This function gets the first piece, and then creates a queue of locations to check out
// Continuously checks out values around me, adding it to a stack.
/* Conditions for total removal:
  This color must be surrounded N S E W by other colors
  We need to keep on checking around us if we're bounded by pieces of the same color
  We should therefore search out the locations around us, and if they're the same color, 
  just keep on looking for where we're at
  Keep a stack full of IDs of pieces? Then we can do some math to figure out our bounds, and also
  Remove all of the necessary things
  */
function checkRemoval(row, col) {}

// Implementation of game logic for removal – BFS traversal
// This is utilized before placing a piece
function explore(row, col) {
  // Get passed a pieceID or a row and col; either way works

  // First, grab the current player
  const curPlayer = totalBoard[row][col];
  // Examine the current board state --
  // If the child next to us is the same color, we need to check their children

  // Check north
  // Fix conditions
  if (col - 1 >= 0) {
    // if there's nothing located there, we're not surrounded
    if (!totalBoard[row][col - 1]) {
      return false;
    }
    // if above is bounded by curPlayer, then we need to keep on checking that piece
    if (totalBoard[row][col - 1] === curPlayer) {
      explore(row, col - 1);
    }
  }

  // Check south
  if (totalBoard[row][col + 1] === curPlayer && col + 1 <= 20) {
    // perform logic here
  }

  // Check east
  if (totalBoard[row + 1][col] === curPlayer && row + 1 <= 20) {
    // perform other logic
  }

  // Check west
  if (totalBoard[row - 1][col] === curPlayer && row - 1 >= 0) {
    // perform other logic'
  }
}

// Function for testing finding object coordinates
goBoardDiv.addEventListener('mousemove', getPosition);

// Function that places the piece
goBoardDiv.addEventListener('click', placePiece);

// FIXME: logic for piece placement
