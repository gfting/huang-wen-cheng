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
}
document.getElementById("goBoard").onmousemove = findObjectCoords;

function placePiece(anchor, position, html) {
    var p = document.getElementById(goBoard);
    let piece = document.createElement('div');
    // insert p1/p2 logic here
    piece.className = "piece";
    piece.innerHTML = html;
    document.body.append(piece);

    positionAt(anchor, position, piece);
}