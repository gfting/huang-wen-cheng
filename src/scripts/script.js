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
for (i = 0; i < totalBoard.length; i++) {
  totalBoard[i] = new Array(20);
}

function findObjectCoords(mouseEvent) {
  let obj = document.getElementById('goBoard');
  let obj_left = 0;
  let obj_top = 0;
  let xpos;
  let ypos;
  while (obj.offsetParent) {
    obj_left += obj.offsetLeft;
    obj_top += obj.offsetTop;
    obj = obj.offsetParent;
  }
  if (mouseEvent) {
    // FireFox
    xpos = mouseEvent.pageX;
    ypos = mouseEvent.pageY;
  }
  //   else
  //   {
  //     //IE
  //     xpos = window.event.x + document.body.scrollLeft - 2;
  //     ypos = window.event.y + document.body.scrollTop - 2;
  //   }
  xpos -= Number(obj_left);
  ypos -= Number(obj_top);

  // Writing coordinates for testing
  document.getElementById('objectCoords').innerHTML =
    'Current coordinates:<br>' + xpos + ', ' + ypos;
  return { xpos, ypos };
}

function togglePlayer() {
  if (currentPlayer === 'white') {
    currentPlayer = 'black';
  } else {
    currentPlayer = 'white';
  }
}
// Implementation of placing the piece
function placePiece(mouseEvent) {
  const piece = document.createElement('img');

  const locations = findObjectCoords(mouseEvent);

  // insert p1/p2 logic here
  piece.className = 'piece';
  if (currentPlayer === 'white') {
    piece.src = 'assets/white-piece.png';
  } else {
    piece.src = 'assets/black-piece.png';
  }
  piece.style.width = '15px';
  piece.style.height = '15px';
  piece.style.position = 'absolute';
  const grid = getRowCol(locations.xpos, locations.ypos);
  // potential error here to load the board with the wrong player if they toggle really quick
  totalBoard[grid.row][grid.col] = currentPlayer;
  console.log(grid.row);
  console.log(totalBoard[grid.row][grid.col]);
  console.log(spacing);
  let fixedXpos = grid.row * spacing + boardOffset / 3;
  let fixedYpos = grid.col * spacing + boardOffset / 3;

  piece.style.marginLeft = fixedXpos + 'px';
  piece.style.marginTop = fixedYpos + 'px';
  // piece.innerHTML = html;

  document.getElementById('goBoard').appendChild(piece);
}

function getRowCol(xpos, ypos) {
  // finds basic column and row
  let row = (xpos / spacing) | 0;
  let col = (ypos / spacing) | 0;

  // figures out how much it's shifted over in the column
  let shiftX = xpos % spacing;
  let shiftY = ypos % spacing;

  // if this shift is greater than half, that means it was closer to the other pos
  if (shiftX > spacing / 2 && row !== 20) {
    row += 1;
  }
  if (shiftY > spacing / 2 && row !== 20) {
    col += 1;
  }
  return { row, col };
}

// Function for testing finding object coordinates
document.getElementById('goBoard').onmousemove = findObjectCoords;

// Function that actually places the piece
document.getElementById('goBoard').onclick = placePiece;
