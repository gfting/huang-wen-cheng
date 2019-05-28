// class based structure for piece FIXME
import Piece from './Piece.js';
// Starts off the game with player that goes first
let currentPlayer = 'black';

// gets the total size of the board, finds appropriate spacing
const goBoardDiv = document.getElementById('goBoard');
const boardElementImg = document.getElementById('goBoard-img');
const boardPositionInfo = boardElementImg.getBoundingClientRect();
const boardWidth = boardPositionInfo.width;
const boardFullOffset = (22 / 400) * boardWidth; // calculation based on ratio
const boardOffset = boardFullOffset / 2;
const numLines = 19; // original style of board
const spacing = (boardWidth - boardFullOffset) / (numLines - 1); // calculates spacing between columns
const pieceSize = 15;
const pieceOffset = pieceSize / 2; // need to shift up by half the piece offset
let blackScore = 0;
let whiteScore = 0;

// Create 2-D array to hold all objects
const totalBoard = [numLines];
for (let i = 0; i < numLines; i += 1) {
  totalBoard[i] = [numLines];
  totalBoard[i][0] = undefined; // workaround for some unexpected behaviors
}

/**
 * Flips the player from current state
 */
function togglePlayer() {
  currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
}

/**
 * Derives the row and column of the xpos and ypos input based on spacing and height of the goBoard div
 * @param {Number} xpos the x position within the object
 * @param {Number} ypos the y position within the object
 */
// generates row and column based on input xpos and ypos
function genRowCol(xpos, ypos) {
  // finds basic column and row
  const row = Math.round((xpos - boardOffset) / spacing);
  const col = Math.round((ypos - boardOffset) / spacing);
  return { row, col };
}

/**
 * Finds the coordinates within the goBoard div, and then writes those coords to the objectCoords div
 * Utilized as actively writing on mouse move
 * @param {mouseEvent} e mouseevent that executes the function
 */
function getPosition(e) {
  const x = e.clientX - boardPositionInfo.left;
  const y = e.clientY - boardPositionInfo.top;
  document.getElementById('objectCoords').innerHTML = `Current coordinates:<br>${x}, ${y}`;
  const grid = genRowCol(x, y);
  document.getElementById('pieceRowCol').innerHTML = `Board Location:<br>row:${grid.row}, col:${
    grid.col
  }`;
  // automatically hovers cursor as a piece depending on current player
  const hoverSrc =
    currentPlayer === 'white' ? '../assets/white-piece.png' : '../assets/black-piece.png';
  goBoardDiv.style.cursor = `url(${hoverSrc}), auto;`;

  return { x, y };
}

/**
 * Given a row and column, this helper function returns if they fit on board
 * @param {Number} row – y axis row
 * @param {Number} col – x axis col
 */
function validLocation(row, col) {
  return row >= 0 && row < numLines && col >= 0 && col < numLines;
}

/**
 * returns true if the piece is found in the array
 * @param {Piece} piece - piece to be checked if in array
 * @param {Array} array - array that piece will be checked again
 */
function inArray(piece, array) {
  let found = false;
  array.forEach(function pieceExists(Element) {
    if (Element === piece) {
      found = true;
    }
  });
  return found;
}

/**
 * removes all elements in the explored queue
 * @param {Array} capturedPieces - all pieces that will need to be removed
 */
function emptyCaptured(capturedPieces) {
  // iterates through each piece in the explored array and removes it from the board
  capturedPieces.forEach(
    // removes a single piece
    function removePiece(piece) {
      // removes piece from the DOM
      document.getElementById(piece.pieceID).remove();

      // removes the piece from the board array
      delete totalBoard[piece.row][piece.col];
    }
  );
}

/**
 * given a piece, it will add on connected pieces onto the array
 * @param {Piece} piece - piece object that's goign to get proceeded
 * @param {Array} connectedPieces - array of connected pieces
 */
function getConnected(piece, connectedPieces = []) {
  // adds the current piece to the array
  connectedPieces.push(piece);

  // grab the inital color of the first piece in the array
  const curColor = connectedPieces[0].color;

  // process neighboring points: either will be the piece located at that location, or be undefined
  const { row } = piece;
  const { col } = piece;
  const northPiece = validLocation(row, col - 1) ? totalBoard[row][col - 1] : undefined;
  const southPiece = validLocation(row, col + 1) ? totalBoard[row][col + 1] : undefined;
  const westPiece = validLocation(row - 1, col) ? totalBoard[row - 1][col] : undefined;
  const eastPiece = validLocation(row + 1, col) ? totalBoard[row + 1][col] : undefined;

  // if the piece is undefined, a different color, or already within our connected array, we don't want to add it to our array of connected pieces
  if (
    northPiece !== undefined &&
    northPiece.color === curColor &&
    !inArray(northPiece, connectedPieces)
  ) {
    getConnected(northPiece, connectedPieces);
  }
  if (
    southPiece !== undefined &&
    southPiece.color === curColor &&
    !inArray(southPiece, connectedPieces)
  ) {
    getConnected(southPiece, connectedPieces);
  }
  if (
    westPiece !== undefined &&
    westPiece.color === curColor &&
    !inArray(westPiece, connectedPieces)
  ) {
    getConnected(westPiece, connectedPieces);
  }
  if (
    eastPiece !== undefined &&
    eastPiece.color === curColor &&
    !inArray(eastPiece, connectedPieces)
  ) {
    getConnected(eastPiece, connectedPieces);
  }

  return connectedPieces;
}

/**
 * Finds all the empty spaces that need to be filled for this piece
 * @param {Piece} initialPiece - the first piece that will be proceeded to find liberties
 */
function getLiberties(initialPiece) {
  // grabs array of pieces connected to this piece
  const connectedPieces = getConnected(initialPiece);

  // initializes liberties
  const liberties = [];

  // for each piece, process its liberties if they exist
  connectedPieces.forEach(function findIndividualLiberties(piece) {
    // process neighboring points: either will be the piece located at that location, or be undefined
    const { row } = piece;
    const { col } = piece;
    const northPiece = validLocation(row, col - 1) ? totalBoard[row][col - 1] : undefined;
    const southPiece = validLocation(row, col + 1) ? totalBoard[row][col + 1] : undefined;
    const westPiece = validLocation(row - 1, col) ? totalBoard[row - 1][col] : undefined;
    const eastPiece = validLocation(row + 1, col) ? totalBoard[row + 1][col] : undefined;

    // if this is an empty location, then we should put on it on our empty locations. This means that it's
    // both undefined (no piece exists there), and it's on the board (i.e. not something that completely doesn't exist)
    // equivalent of being 'empty'
    if (northPiece === undefined && validLocation(row, col - 1)) {
      liberties.push([row, col - 1]); // dummy information
    }
    if (southPiece === undefined && validLocation(row, col + 1)) {
      liberties.push([row, col + 1]); // dummy information
    }
    if (westPiece === undefined && validLocation(row - 1, col)) {
      liberties.push([row - 1, col]); // dummy information
    }
    if (eastPiece === undefined && validLocation(row + 1, col)) {
      liberties.push([row + 1, col]); // dummy information
    }
  });
  return liberties;
}

// This function gets the first piece, and then creates a queue of locations to check out
/* Conditions for total removal:
  This color must be surrounded N S E W by other colors
  We need to keep on checking around us if we're bounded by pieces of the same color
  We should therefore search out the locations around us, and if they're the same color, 
  just keep on looking for where we're at
  Keep a stack full of IDs of pieces? Then we can do some math to figure out our bounds, and also
  Remove all of the necessary things
  */
/**
 *
 * @param {*} piece
 */
function checkRemoval(piece) {
  // array of pieces that are captured with this piece's placement
  let capturedPieces = [];

  // this piece's color
  const curColor = piece.color;

  // create connected queue so we can peek the initial val
  const connectedPieces = [];

  // process neighboring points: either will be the piece located at that location, or be undefined
  const { row } = piece;
  const { col } = piece;
  const northPiece = validLocation(row, col - 1) ? totalBoard[row][col - 1] : undefined;
  const southPiece = validLocation(row, col + 1) ? totalBoard[row][col + 1] : undefined;
  const westPiece = validLocation(row - 1, col) ? totalBoard[row - 1][col] : undefined;
  const eastPiece = validLocation(row + 1, col) ? totalBoard[row + 1][col] : undefined;

  // if this is an empty location, then we should put on it on our empty locations. This means that it's
  // both undefined (no piece exists there), and it's on the board (i.e. not something that completely doesn't exist)
  if (northPiece !== undefined) {
    if (northPiece.color !== curColor) {
      if (!inArray(northPiece, capturedPieces) && getLiberties(northPiece).length === 0) {
        capturedPieces = capturedPieces.concat(getConnected(northPiece, connectedPieces));
      }
    }
  }
  if (southPiece !== undefined) {
    if (southPiece.color !== curColor) {
      if (!inArray(southPiece, capturedPieces) && getLiberties(southPiece).length === 0) {
        capturedPieces = capturedPieces.concat(getConnected(southPiece, connectedPieces));
      }
    }
  }
  if (westPiece !== undefined) {
    if (westPiece.color !== curColor) {
      if (!inArray(westPiece, capturedPieces) && getLiberties(westPiece).length === 0) {
        capturedPieces = capturedPieces.concat(getConnected(westPiece, connectedPieces));
      }
    }
  }
  if (eastPiece !== undefined) {
    if (eastPiece.color !== curColor) {
      if (!inArray(eastPiece, capturedPieces) && getLiberties(eastPiece).length === 0) {
        capturedPieces = capturedPieces.concat(getConnected(eastPiece, connectedPieces));
      }
    }
  }

  return capturedPieces;
}

/**
 * generates and creates a piece based on current location; event is onclick
 * @param {mouseEvent} e – mouse event that prompts execution
 */
function placePiece(e) {
  // gets current location's x and y
  const location = getPosition(e);

  // finds row and column information based on x and y
  const grid = genRowCol(location.x, location.y);
  const { row } = grid;
  const { col } = grid;
  document.getElementById('pieceRowCol').innerHTML = `Board Location:<br>row:${row}, col:${col}`;

  // creates piece and sets styles
  const piece = new Piece(currentPlayer, row, col);
  const { pieceEl } = piece;

  // basic prevention of duplicate pieces
  if (totalBoard[row][col] !== undefined) {
    alert("There's a piece here already!");
  } else {
    // calculates position on the board based on row and col
    const fixedXpos = row * spacing + boardOffset - pieceOffset;
    const fixedYpos = col * spacing + boardOffset - pieceOffset;
    pieceEl.style.marginLeft = `${fixedXpos}px`;
    pieceEl.style.marginTop = `${fixedYpos}px`;

    // loads piece object into the array
    totalBoard[row][col] = piece;

    // ends by appending the element of the piece to the board
    goBoardDiv.appendChild(pieceEl);

    // checks if there's anything that needs to be removed when this piece is placed
    const capturedPieces = checkRemoval(piece);
    if (capturedPieces.length !== 0) {
      // add to the score here by the length
      if (currentPlayer === 'black') {
        blackScore += capturedPieces.length;
      } else {
        whiteScore += capturedPieces.length;
      }

      // update the scores on the DOM
      document.getElementById(
        'scoreBoard'
      ).innerHTML = `Captured Pieces:<br>Black: ${blackScore}, White: ${whiteScore}`;
      // remove all the pieces from the captured array
      emptyCaptured(capturedPieces);
    }
    // ends by switching to the other player
    togglePlayer();
  }
}

// Function for testing finding object coordinates
goBoardDiv.addEventListener('mousemove', getPosition);

// Function that places the piece
goBoardDiv.addEventListener('click', placePiece);

// Attaches togglePlayer to the button
document.getElementById('togglePlayer').onclick = togglePlayer;
