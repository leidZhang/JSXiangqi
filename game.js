import { Board } from './board.js'; 

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
            cell.addEventListener("click",clickBoard,false);
        }
    }

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
        chessboard.init();
        if(!chessboard.status){
             
        }
    },false);
    beginText.style.position="absolute";
    beginText.style.top="200px";
    beginText.style.left="1000px";
    document.body.appendChild(beginText);
})(); 

// red turn?
(function(){
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
            console.log(x + "," + y);  
            // move piece
            chessboard.movePiece(chessboard.curPiece, x, y);
        }
        event.stopPropagation();
    } else {
        // game over
        event.stopPropagation();
    }
}

// select piece
function choosePiece(event){
    if(chessboard.status){
        if(chessboard.turn == !!this.getAttribute("data-team") && !chessboard.curPiece){
            var x = parseInt(this.parentNode.getAttribute("data-x"));
            var y = parseInt(this.parentNode.getAttribute("data-y"));
            // select piece
            chessboard.curPiece = chessboard.pieces[x][y];
            chessboard.curPiece.piece.style.backgroundColor="#B0E0E6";
             
            event.stopPropagation();
        }
    } else {
        event.stopPropagation(); // stop popup
    }
}

function createPieces(x, y, icon, color) {
    var div = document.createElement("div");
    div.setAttribute("data-color", color === "red" ? "red" : "black");
    div.classList.add("pieces");
    div.classList.add(color === "red" ? "red" : "black");
    div.appendChild(document.createTextNode(icon));
    tBody.rows[y].cells[x].appendChild(div);
    return div;
}

const chessboard = new Board(); 
chessboard.initBoard(); 
console.log(chessboard.board); 

for (let i=0; i<=8; i++) {
    for (let j=0; j<=9; j++) {
        var piece = chessboard.board[i][j]; 
        if (piece == null) continue; 
        createPieces(i, j, piece.icon, piece.color); 
    }
}