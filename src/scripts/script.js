let currentPlayer = 'white';
// gets the total size of the board, finds appropriate spacing
const element = document.getElementById('goBoard-img');
const positionInfo = element.getBoundingClientRect();
const height = positionInfo.height;
const totalWidth = positionInfo.width;
const boardOffset = (24 / 400) * totalWidth;
const spacing = (totalWidth - boardOffset) / 20;

// Create 2-D array to hold all values
var totalBoard = new Array(20);
for (i = 0; i < totalBoard.length; ++i) {
  totalBoard[i] = new Array(20);
}

// Toggles player
function togglePlayer() {
  currentPlayer = currentPlayer === 'white' ? (currentPlayer = 'black') : (currentPlayer = 'white');
}

function findObjectCoords(mouseEvent) {
  let obj = document.getElementById('goBoard-img');
  let objLeft = 0;
  let objTop = 0;
  let xpos;
  let ypos;
  while (obj.offsetParent) {
    objLeft += obj.offsetLeft;
    objTop += obj.offsetTop;
    obj = obj.offsetParent;
  }
  console.log(objLeft);
  console.log(objTop);
  if (mouseEvent) {
    // FireFox
    xpos = mouseEvent.pageX;
    ypos = mouseEvent.pageY;
  }
  console.log(xpos);
  console.log(ypos);
  //   else
  //   {
  //     //IE
  //     xpos = window.event.x + document.body.scrollLeft - 2;
  //     ypos = window.event.y + document.body.scrollTop - 2;
  //   }
  xpos -= Number(objLeft);
  ypos -= Number(objTop);

  // Writing coordinates for testing
  document.getElementById('objectCoords').innerHTML =
    'Current coordinates:<br>' + xpos + ', ' + ypos;
  return { xpos, ypos };
}

function getPosition(e) {
  let rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  return {
    x,
    y
  };
}

// Implementation of placing the piece
function placePiece(mouseEvent) {
  // gets location
  const location = getPosition(mouseEvent);

  // creates piece and sets styles
  const piece = document.createElement('img');
  piece.className = 'piece';
  piece.style.width = '15px'; // todo: change to proportion
  piece.style.height = '15px';
  piece.style.position = 'absolute';

  // determines which player it is
  piece.src = currentPlayer === 'white' ? 'assets/white-piece.png' : 'assets/black-piece.png';

  console.log(location.x);
  console.log(location.y);

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

  piece.style.marginLeft = fixedXpos + 'px';
  piece.style.marginTop = fixedYpos + 'px';
  // piece.innerHTML = html;

  document.getElementById('goBoard-img').appendChild(piece);
}

function getRowCol(xpos, ypos) {
  // finds basic column and row
  let row = Math.round(xpos / spacing);
  let col = Math.round(ypos / spacing);
  return { row, col };
}

// Function for testing finding object coordinates
document.getElementById('goBoard-img').onmousemove = findObjectCoords;
document.getElementById('goBoard-img').addEventListener('click', placePiece);

// // Function that actually places the piece
// document.getElementById('goBoard-img').onclick = placePiece;

// FIXME: logic for piece placement
