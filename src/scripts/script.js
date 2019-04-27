let currentPlayer = 'white';
var element = document.getElementById('goBoard-img');
var positionInfo = element.getBoundingClientRect();
var height = positionInfo.height;
var totalWidth = positionInfo.width;
const spacing = (totalWidth - 24) / 20;

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
  console.log(locations);

  // insert p1/p2 logic here
  piece.className = 'piece';
  if (currentPlayer === 'white') {
    piece.src = 'assets/white-piece.png';
  } else {
    piece.src = 'assets/black-piece.png';
  }
  piece.style.width = '15px';
  piece.style.height = '15px';
  piece.style.marginLeft = '400px';
  piece.style.marginTop = '400px';
  piece.style.position = 'absolute';
  const grid = getRowCol(locations.xpos, locations.ypos);
  console.log(grid);
  let fixedXpos = grid.row * spacing;
  let fixedYpos = grid.col * spacing;
  console.log(fixedXpos);
  piece.style.marginLeft = fixedXpos + 'px';
  piece.style.marginTop = fixedYpos + 'px';
  // piece.innerHTML = html;

  document.getElementById('goBoard').appendChild(piece);
}

function getRowCol(xpos, ypos) {
  // gets the total size of the board, finds appropriate spacing

  // finds basic column and row
  let row = (xpos / spacing) | 0;
  let col = (ypos / spacing) | 0;

  // figures out how much it's shifted over in the column
  let shiftX = xpos % spacing;
  let shiftY = ypos % spacing;

  // if this shift is greater than half, adds to row
  if (shiftX > spacing / 2) {
    row += 1;
  }
  if (shiftY > spacing / 2) {
    col += 1;
  }
  return { row, col };
}

// Function for testing finding object coordinates
document.getElementById('goBoard').onmousemove = findObjectCoords;

// Function that actually places the piece
document.getElementById('goBoard').onclick = placePiece;
