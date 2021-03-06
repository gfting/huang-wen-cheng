// class based structure for piece
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
let blackScore = 0; // starting score for black
let whiteScore = 0;

// 2-D array to hold all objects, which will be either pieces or undefined
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
 * @return {JSON} an object with row and col in it
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
 * Called on active mouse move, writes to the screen
 * @param {mouseEvent} e mouseEvent that executes the function
 */
function getPosition(e) {
  // Finds the current x/y distance from the edges of the board
  const x = e.clientX - boardPositionInfo.left;
  const y = e.clientY - boardPositionInfo.top;
  // Writes the coordinates to the page
  document.getElementById('objectCoords').innerHTML = `Current coordinates:<br>${x}, ${y}`;
  // Gets the grid position and then writes it back to the page
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
 * Given a row and column, this helper function returns if they should be valid locations on the board
 * @param {Number} row – y axis row
 * @param {Number} col – x axis col
 */
function validLocation(row, col) {
  return row >= 0 && row < numLines && col >= 0 && col < numLines;
}

/**
 * helper function that returns true if the piece is in the array, false if not
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
 * removes all elements from the page in the explored queue utilizing each piece's pieceID
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
 * This function gets the row and column of a piece, and then returns an array of JSON objects with properties about the pieces in cardinal directions (North, South, West, East). It has the piece, if the location is valid (i.e. is on the board), and the row/col location of the piece. Respectively, these fields are named piece, validPos, and xy.
 * @param {int} row – the row of the piece
 * @param {int} col - the column of the piece
 * @return {Array} – as stated above, an array with JSON objects corresponding to the piece, if it's a valid location as a boolean, and the row/col location of the piece. Respectively named piece, validPos, and xy.
 */
function getCardinal(row, col) {
  // the directions that will change row and col
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  // function that takes in the position array and then generates an object from it with the piece, if it's a valid location, and the row/col position of cardinal direction.
  function createPieceObject(posArr) {
    const thisRow = posArr[0];
    const thisCol = posArr[1];
    return validLocation(thisRow, thisCol)
      ? { piece: totalBoard[thisRow][thisCol], validPos: true, xy: [thisRow, thisCol] }
      : { piece: undefined, validPos: false, xy: [thisRow, thisCol] };
  }

  // array to hold the pieces that will be returned
  const cardinalPieces = [];

  // for each direction, creates the object and then pushes it to the cardinalPieces array
  dirs.forEach(dir => {
    const posArr = [row + dir[0], col + dir[1]];
    cardinalPieces.push(createPieceObject(posArr));
  });

  return cardinalPieces;
}

/**
 * given a piece, it will add on connected pieces onto the array. This is a helper to see what liberties we have and also to see what pieces we may need to remove
 * @param {Piece} piece - piece object that's going to get proceeded
 * @param {Array} connectedPieces - current array of connected pieces
 * @return {Array} connectedPieces – all the connected pieces related to this piece
 */
function getConnected(piece, connectedPieces = []) {
  // adds the current piece to the array
  connectedPieces.push(piece);

  // grab the inital color of the first piece in the array
  const curColor = connectedPieces[0].color;

  // process neighboring points: either will be the piece located at that location, or be undefined. Gets the pieces in the cardinal directions based on the current row and column
  const { row } = piece;
  const { col } = piece;
  const surPieces = getCardinal(row, col);

  // if the piece is undefined, a different color, or already within our connected array, we don't want to add it to our array of connected pieces as it isn't part of our connected body. surPieceObj is the surrounding piece as an object coming back from the getCardinal function
  surPieces.forEach(surPieceObj => {
    // gets the piece attribute of piece
    const surPiece = surPieceObj.piece;
    if (
      surPiece !== undefined &&
      surPiece.color === curColor &&
      !inArray(surPiece, connectedPieces)
    ) {
      // recursively grab all of pieces connected to the surrounding pieces
      getConnected(surPiece, connectedPieces);
    }
  });

  return connectedPieces;
}

/**
 * Finds all the empty spaces that need to be filled for this piece to be removed, aka the liberties. If the length of liberties === 0, then we know that the piece that got passed in should be removed.
 * @param {Piece} initialPiece - the first piece that will be proceeded to find liberties
 * @return {Array[Piece]} liberties – returns the empty cardinal locations around initialPiece that need to be filled in order for the initalPiece to be removed
 */
function getLiberties(initialPiece) {
  // grabs array of all pieces connected to this piece of the same color
  const connectedPieces = getConnected(initialPiece);

  // initializes liberties
  const liberties = [];

  // for each piece, process its liberties if they exist
  connectedPieces.forEach(function findIndividualLiberties(piece) {
    // process neighboring points: either will be the piece located at that location, or be undefined
    const { row } = piece;
    const { col } = piece;
    // get the surrounding pieces in cardinal directions
    const surPieces = getCardinal(row, col);

    // if this is an empty location, then we should put on it on our empty locations. This means that it's both undefined (no piece exists there), and it's on the board (i.e. not something that completely doesn't exist), the equivalent of being 'empty'
    surPieces.forEach(surPieceObj => {
      // gets the piece attribute of piece
      const surPiece = surPieceObj.piece;

      // gets if this is on the board–a valid direction
      const validDirection = surPieceObj.validPos;

      // if this is a valid location, pushes the xy location to the liberties array–making the length of liberties non-0 and therefore another space that the enemy piece needs to fill
      if (surPiece === undefined && validDirection) {
        liberties.push(surPieceObj.xy);
      }
    });
  });
  return liberties;
}

/**
 * This function gets the first piece, and then searches all of the surrounding locations around that piece to see if it can potentially remove a piece
 * Note on Conditions for total removal:
 * This color must be surrounded N S E W by other colors
 * We need to keep on checking around us if we're bounded by pieces of the same color. We should therefore search out the locations around us, and if they're the same color, just keep on looking for where we're at.
 * Keep a stack full of IDs of pieces would allow us to figure out our bounds, and also remove all of the necessary things on return
 * @param {Piece} piece
 * @return {Array[Pieces]} all of the pieces
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

  // gets the surroudning pieces in cardinal directions
  const surPieces = getCardinal(row, col);

  // If the surroudning piece isn't undefined, it isn't the same color, and it isn't in our array of pieces, and the call to getLiberties is 0, that means that the surrounding piece is completely blocked in and should be added to our capturedPieces array.
  surPieces.forEach(surPieceObj => {
    // Gets the piece value from the piece attribute of the surPiece object
    const surPiece = surPieceObj.piece;
    if (
      surPiece !== undefined &&
      surPiece.color !== curColor &&
      !inArray(surPiece, capturedPieces) &&
      getLiberties(surPiece).length === 0
    ) {
      // The call to capturedPieces makes sure that we grab all of the pieces directly connected to the surrounding piece so that we can remove all of them at once.
      capturedPieces = capturedPieces.concat(getConnected(surPiece, connectedPieces));
    }
  });
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
