function findObjectCoords(mouseEvent)
{
  var obj = document.getElementById("goBoard");
  var obj_left = 0;
  var obj_top = 0;
  var xpos;
  var ypos;
  while (obj.offsetParent)
  {
    obj_left += obj.offsetLeft;
    obj_top += obj.offsetTop;
    obj = obj.offsetParent;
  }
  if (mouseEvent)
  {
    //FireFox
    xpos = mouseEvent.pageX;
    ypos = mouseEvent.pageY;
  }
//   else
//   {
//     //IE
//     xpos = window.event.x + document.body.scrollLeft - 2;
//     ypos = window.event.y + document.body.scrollTop - 2;
//   }
  xpos -= obj_left;
  ypos -= obj_top;
  
  // Writing coordinates for testing
  document.getElementById("objectCoords").innerHTML = xpos + ", " + ypos;
  return {xpos, ypos};
}

// Implementation of placing the piece
function placePiece() {
    let piece = document.createElement("img");

    let locations = findObjectCoords;

    // insert p1/p2 logic here
    piece.className = "piece";
    piece.src = "assets/black-piece.png";
    piece.style.marginLeft = locations[0];
    piece.style.marginTop = locations[1];
    // piece.innerHTML = html;

    document.getElementById("goBoard").appendChild(piece);
}

// Function for testing finding object coordinates
document.getElementById("goBoard").onmousemove = findObjectCoords;

// Function that actually places the piece
document.getElementById("goBoard").onclick = placePiece();