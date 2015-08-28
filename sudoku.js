// Sudoku puzzle and solution from Austin Chau
// http://googlewavedev.blogspot.com/2009/06/making-of-sudoku-gadget.html

var PUZZLE = [0,8,2,4,0,5,7,0,3,0,1,0,6,8,3,5,0,0,5,3,9,7,0,0,6,4,8,0,7,4,3,5,6,1,8,9,8,0,0,9,0,7,0,0,6,9,6,3,1,2,8,4,7,0,7,4,5,0,0,9,2,3,1,0,0,8,5,3,4,0,6,0,3,0,6,2,0,1,8,5,0];
var SOLUTION = [6,8,2,4,9,5,7,1,3,4,1,7,6,8,3,5,9,2,5,3,9,7,1,2,6,4,8,2,7,4,3,5,6,1,8,9,8,5,1,9,4,7,3,2,6,9,6,3,1,2,8,4,7,5,7,4,5,8,6,9,2,3,1,1,2,8,5,3,4,9,6,7,3,9,6,2,7,1,8,5,4];

function addRows(parent, numRows, numCols) {
  for(var i = 0; i < numRows; i++) {
    var row = document.createElement('tr');
    row.setAttribute('id', i);
    addColumnsIntoRow(row, numCols);
    parent.appendChild(row);
  }
}

function addColumnsIntoRow(row, numCols) {
  for(var i = 0; i < numCols; i++) {
    var column = document.createElement('td');
    column.setAttribute('id', row.getAttribute('id') + ',' + i);
    row.appendChild(column);
  }
}

function getCell(row, col) {
  return document.getElementById(row + ',' + col);
}

function populateTable(puzzleNums) {
  var edgeLength = Math.sqrt(puzzleNums.length);
  for(var r = 0; r < edgeLength; r++) {
    for(var c = 0; c < edgeLength; c++) {
      var cellText = puzzleNums[r * edgeLength + c];
      if(cellText == 0) cellText = "";
      getCell(r, c).innerHTML = cellText;
    }
  }
}

window.onload = function () {
  console.log('Loaded...');
  puzzleDiv = document.getElementById('puzzle');
  var table = document.createElement('table');
  addRows(table, 9, 9);
  puzzleDiv.appendChild(table);

  populateTable(PUZZLE);
}
