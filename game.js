import { Board } from './board.js'; 

const chessboard = new Board(); 
chessboard.initBoard(); 
console.log(chessboard.board); 

// set board shape
(function() {
    window.table = document.createElement("table");
    window.tBody = document.createElement("tBody");
    table.classList.add("board");

    for(var i=0;i<9;i++){
        var row = tBody.insertRow(i);
        for(var j=0;j<8;j++){
            var cell = row.insertCell(j);
            if(i!=4){cell.classList.add("board")}
        }
    }

    table.style.position="absolute";
    table.style.top="80px";
    table.style.left="280px";
    table.appendChild(tBody);
    document.body.appendChild(table);
})();

// generate board
(function() {
    window.table = document.createElement("table");
    window.tBody = document.createElement("tBody");

    for(var i=0;i<10;i++){
        window.row = tBody.insertRow(i);
        for(var j=0;j<9;j++){
            var cell = row.insertCell(j);
            cell.setAttribute("data-x",j);
            cell.setAttribute("data-y",i);
            cell.addEventListener("click", clickBoard, false);
        }
    }

    table.setAttribute("id", "chessboardContainer"); 
    table.appendChild(tBody);
    table.style.position="absolute";
    table.style.top="50px";
    table.style.left="250px";
    document.body.appendChild(table);
})(); 

// game start
(function() {
    window.beginText = document.createElement("h1");
    beginText.style.display="inline";
    beginText.innerHTML="Game Start";
    beginText.addEventListener("click", function(event){
        chessboard.initBoard();
        if(!chessboard.status){
             
        }
    },false);
    beginText.style.position="absolute";
    beginText.style.top="200px";
    beginText.style.left="1000px";
    document.body.appendChild(beginText);
})(); 

// red turn?
(function() {
    window.turnText = document.createElement("h1");
    turnText.innerHTML="Red";
    turnText.style.position="absolute";
    turnText.style.top="250px";
    turnText.style.left="1000px";
    document.body.appendChild(turnText);
})();

// click board
function clickBoard(event) {
    if(chessboard.status) { 
        if(chessboard.curPiece) {
            var x = parseInt(this.getAttribute("data-x"));
            var y = parseInt(this.getAttribute("data-y"));
            console.log("now at " + chessboard.curPiece.col + ", " + chessboard.curPiece.row); 
            console.log("attempting to " + x + ", " + y); 
            // attempt to move the piece
            var res = chessboard.movePiece(chessboard.curPiece, x, y);
            console.log(chessboard.board); 
            if (res) executeMove(x, y);
        }
        event.stopPropagation();
    } else {
        event.stopPropagation(); // stop popup 
    }     
}

// choose piece
function choosePiece(event) {
    if (chessboard.status) {
        // select piece
        var clickedPiece = event.target;
        console.log(clickedPiece);
        if (clickedPiece.classList.contains("pieces")) {
            var x = parseInt(clickedPiece.parentNode.getAttribute("data-x"));
            var y = parseInt(clickedPiece.parentNode.getAttribute("data-y"));
            console.log("Current position: " + x + ", " + y); 
            chessboard.curPiece = chessboard.board[x][y];
        }

        if (chessboard.turn == clickedPiece.getAttribute("data-color") && chessboard.curPiece) {
            clickedPiece.style.backgroundColor = "#B0E0E6";
            event.stopPropagation();
        }
    } else {
        event.stopPropagation(); // stop popup
    }

    console.log("select a piece"); 
    initListeners();
}

// cancel selection 
function cancelPiece(event) {
    var clickedPiece = event.target;
    var selectedPiece = null; 
    console.log("cancel: " + clickedPiece);

    if (clickedPiece) {
        var x = parseInt(clickedPiece.parentNode.getAttribute("data-x"));
        var y = parseInt(clickedPiece.parentNode.getAttribute("data-y"));
        selectedPiece = chessboard.board[x][y];
    }

    if (chessboard.status) {
        if (chessboard.curPiece.id == selectedPiece.id) {
            clickedPiece.style.backgroundColor = "#FAF0E6";
            chessboard.curPiece = null;
        }
    }

    console.log("cancel piece");
    initListeners();
}

function initListeners() {
    var divs = document.getElementsByClassName("pieces");
    for (var i = 0; i < divs.length; i++) {
        divs[i].removeEventListener("click", choosePiece);
        divs[i].removeEventListener("click", cancelPiece);
  
        if (chessboard.curPiece == null) {
            divs[i].addEventListener("click", choosePiece, false);
        } else {
            divs[i].addEventListener("click", cancelPiece, false);
        }

        console.log("Current Piece: " + chessboard.curPiece); 
    }
}

function executeMove(newRow, newCol) {
    // execute move
}

// create pieces
function createPieces(x, y, icon, color, id) {
    var div = document.createElement("div");
    div.setAttribute("id", id); 
    div.setAttribute("data-color", color === "red" ? "red" : "black");
    div.classList.add("pieces");
    div.classList.add(color === "red" ? "red" : "black");
    div.appendChild(document.createTextNode(icon));
    tBody.rows[y].cells[x].appendChild(div);
    return div;
}

function renderBoard() {
    for (let i=0; i<=8; i++) {
        for (let j=0; j<=9; j++) {
            var piece = chessboard.board[i][j]; 
            if (piece != null) {
                createPieces(i, j, piece.icon, piece.color, piece.id); 
            }
        }
    }
}

renderBoard(); 
console.log(chessboard.board); 
window.addEventListener("load", initListeners);
