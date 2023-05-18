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
    table.style.top="200px";
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
            cell.setAttribute("data-x",i);
            cell.setAttribute("data-y",j);
            cell.addEventListener("click", clickBoard, false);
        }
    }

    table.setAttribute("id", "chessboardContainer"); 
    table.appendChild(tBody);
    table.style.position="absolute";
    table.style.top="170px";
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
    beginText.style.position = "absolute";
    beginText.style.top = "200px";
    beginText.style.left ="1000px";
    document.body.appendChild(beginText);
})(); 

// initial status
(function() {
    window.turnText = document.createElement("h1");
    turnText.innerHTML = "Red Turn";
    turnText.style.position = "absolute";
    turnText.style.top = "250px";
    turnText.style.left = "1000px";
    document.body.appendChild(turnText);

    var button = document.createElement("button");
    button.innerHTML = "Reset Game";
    button.setAttribute("id", "resetBtn");
    button.style.position = "absolute";
    button.style.top = "330px";
    button.style.left = "1000px";
    button.addEventListener("click", handleClick);
    document.body.appendChild(button);

    var movesContainer = document.createElement("div");
    movesContainer.setAttribute("id", "movesContainer");
    movesContainer.style.position = "absolute";
    movesContainer.style.top = "410px";
    movesContainer.style.left = "1000px";
    movesContainer.style.width = "700px";
    movesContainer.style.height = "430px";
    movesContainer.style.backgroundColor = "lightgray";
    movesContainer.style.overflow = "auto";
    document.body.appendChild(movesContainer);

    // Create the table element
    var moveTable = document.createElement("table");
    moveTable.setAttribute("id", "movesRecords"); 
    movesContainer.appendChild(moveTable);

    // Create the table header row
    var headerRow = moveTable.insertRow();
    var turnHeader = document.createElement("th");
    turnHeader.innerHTML = "Turn";
    headerRow.appendChild(turnHeader);
    var redActionHeader = document.createElement("th");
    redActionHeader.innerHTML = "Red Action";
    headerRow.appendChild(redActionHeader);
    var blackActionHeader = document.createElement("th");
    blackActionHeader.innerHTML = "Black Action";
    headerRow.appendChild(blackActionHeader);

    // Apply spacing between the header cells
    turnHeader.style.paddingLeft = "75px"; 
    turnHeader.style.paddingRight = "75px";
    redActionHeader.style.padding = "0 115px";
    blackActionHeader.style.paddingLeft = "75px";
    blackActionHeader.style.paddingRight = "75px"; 
})();

function handleClick() {
    console.log("Button clicked!");
    location.reload(); // Refresh the page
}

// click board
function clickBoard(event) {
    if(chessboard.status) { 
        if(chessboard.curPiece) {
            var x = parseInt(this.getAttribute("data-x"));
            var y = parseInt(this.getAttribute("data-y"));
            console.log("now at " + chessboard.curPiece.row + ", " + chessboard.curPiece.col); 
            console.log("attempting to " + x + ", " + y); 
            // attempt to move the piece
            var res = chessboard.movePiece(chessboard.curPiece, x, y);
            console.log(chessboard.board); 
            if (res) {
                executeMove(x, y);
            } 
        }
        event.stopPropagation();
    } else {
        event.stopPropagation(); // stop popup 
    }     
}

// execute move
function executeMove(newRow, newCol) {
    var curRow = chessboard.curPiece.row; 
    var curCol = chessboard.curPiece.col; 
    chessboard.board[curRow][curCol] = null; 
    chessboard.board[newRow][newCol] = chessboard.curPiece; 

    var source = document.querySelector(`[data-x="${curRow}"][data-y="${curCol}"]`); 
    var tgt = document.querySelector(`[data-x="${newRow}"][data-y="${newCol}"]`); 
    var clickedPiece = document.getElementById(chessboard.curPiece.id);
    var tgtPiece = tgt.children[0]; 
    console.log(tgtPiece); 

    source.removeChild(clickedPiece);
    if (tgtPiece != null) {
        tgt.removeChild(tgtPiece); 
    }
    tgt.appendChild(clickedPiece); 
    clickedPiece.style.backgroundColor = "#FAF0E6"; 
    
    chessboard.curPiece.row = newRow; 
    chessboard.curPiece.col = newCol; 
    chessboard.curPiece = null; 

    // switch side
    var res = chessboard.isGameOver(); 
    if (res) {
        chessboard.status = false; 
        beginText.innerHTML="Game Over";
         
        if (tgtPiece.getAttribute("data-color") === "red") {
            turnText.innerHTML = "Black Win";
        } else {
            turnText.innerHTML = "Red Win";
        }
    } else {
        moveRecord(); 
        switchSide(); 
        initListeners(); 
    }
}

function moveRecord() {
    var moveTable = document.getElementById("movesRecords"); 
    if (chessboard.turn === "red") {
        chessboard.turnCnt++; 
        console.log("current turn cnt: " + chessboard.turnCnt); 
        var moveRow = moveTable.insertRow(); 
        moveRow.setAttribute("class", "moveRow"); 
        moveRow.setAttribute("data-turn", chessboard.turnCnt); 
        var turnContainer = document.createElement("td"); 
        turnContainer.setAttribute("class", "turnCnt"); 
        var redMoveContainer = document.createElement("td");
        redMoveContainer.setAttribute("class", "redMove"); 
        var blackMoveContainer = document.createElement("td");   
        blackMoveContainer.setAttribute("class", "blackMove"); 

        moveRow.appendChild(turnContainer); 
        turnContainer.innerHTML += chessboard.turnCnt; 
        moveRow.appendChild(redMoveContainer); 
        redMoveContainer.innerHTML += "TEMP"; // test red move
        moveRow.appendChild(blackMoveContainer); 
    } else {
        var moveRow = document.querySelector(`[data-turn="${chessboard.turnCnt}"]`); 
        var blackMoveContainer = moveRow.getElementsByClassName("blackMove"); 
        blackMoveContainer[0].innerHTML = "temp"; // test black move
    }
}

// switch side
function switchSide() {
    if (chessboard.turn == "red") {
        chessboard.turn = "black"; 
        turnText.innerHTML = "Black Turn"; 
    } else {
        chessboard.turn = "red"; 
        turnText.innerHTML = "Red Turn"; 
    }
}

// choose piece
function choosePiece(event) {
    console.log(chessboard.turn); 
    if (chessboard.status) {
        // select piece
        var clickedPiece = event.target;
        if (chessboard.turn != clickedPiece.getAttribute("data-color")) return; // avoid control opponent's pieces

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

        console.log(chessboard.curPiece); 
    }
}

// create pieces
function createPieces(x, y, icon, color, id) {
    var div = document.createElement("div");
    div.setAttribute("id", id); 
    div.setAttribute("data-color", color === "red" ? "red" : "black");
    div.classList.add("pieces");
    div.classList.add(color === "red" ? "red" : "black");
    div.appendChild(document.createTextNode(icon));
    tBody.rows[x].cells[y].appendChild(div);
    return div;
}

function renderBoard() {
    for (let i=0; i<=9; i++) {
        for (let j=0; j<=8; j++) {
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
