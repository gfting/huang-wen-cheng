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
function placePiece(mouseEvent) {
    let piece = document.createElement("img");

    let locations = findObjectCoords(mouseEvent);
    console.log(locations)
    // This gets how big a row should be; 24px right now hardcoded
    let totalWidth = document.getElementById("goBoard").style.width;
    let spacing = (totalWidth - 24) / 20;  

    // insert p1/p2 logic here
    piece.className = "piece";
    piece.src = "assets/white-piece.png";
    piece.style.width = "20px";
    piece.style.height = "20px";
    piece.style.marginLeft = "400px";
    piece.style.marginTop = "400px";
    piece.style.position = "absolute";

    piece.style.marginLeft = locations.xpos + "px";
    piece.style.marginTop = locations.ypos + "px";
    // piece.innerHTML = html;

    document.getElementById("goBoard").appendChild(piece);
}

// Function for testing finding object coordinates
document.getElementById("goBoard").onmousemove = findObjectCoords;

// Function that actually places the piece
document.getElementById("goBoard").onclick = placePiece;