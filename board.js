import { General, Chariot, Horse, Elephant, Advisor, Pawn, Cannon } from './pieces.js'; 

export class Board {
    constructor() {
        this.board = []; // 10 * 9 array
        this.turn = "red"; 
        this.status = true; // game start 
        this.curPiece = null; 
        this.turnCnt = 0; 
    }

    placePiece(pieceInfo) {
        let type = pieceInfo[0]; 
        let color = pieceInfo[1]; 
        let row = parseInt(pieceInfo[2]); 
        let col = parseInt(pieceInfo[3]); 

        switch (type) {
            case "chariot": 
                var icon = (color == "red") ? "车" : "車"; 
                this.board[row][col] = new Chariot(color, icon, col, row); 
                break; 
            case "horse": 
                var icon = (color == "red") ? "马" : "馬"; 
                this.board[row][col] = new Horse(color, icon, col, row); 
                break; 
            case "elephant": 
                var icon = (color == "red") ? "相" : "象"; 
                this.board[row][col] = new Elephant(color, icon, col, row); 
                break; 
            case "advisor": 
                var icon = (color == "red") ? "仕" : "士"; 
                this.board[row][col] = new Advisor(color, icon, col, row); 
                break; 
            case "general": 
                var icon = (color == "red") ? "帅" : "将"; 
                this.board[row][col] = new General(color, icon, col, row); 
                break; 
            case "cannon": 
                var icon = (color == "red") ? "炮" : "砲"; 
                this.board[row][col] = new Cannon(color, icon, col, row); 
                break; 
            case "pawn": 
                var icon = (color == "red") ? "兵" : "卒";
                this.board[row][col] = new Pawn(color, icon, col, row); 
                break; 
            default: 
                break; 
        }
    }

    initBoard(situation) {
        // generate board
        for (let i=0; i<10; i++) { 
            this.board[i] = []; // create a row 
            for (let j=0; j<9; j++) { 
                this.board[i][j] = null; // create an empty slot 
            }
        }

        situation.forEach((pieceInfo) => {
            this.placePiece(pieceInfo); 
        })
        
        // console.log(this.board); 
    } 

    movePiece(piece, newRow, newCol) { 
        // check if the new position is within the board 
        if (newRow < 0 || newRow > 9 || newCol < 0 || newCol > 8) { 
            return false; 
        }

        // check if suiside
        if (this.isSuisideMove(piece, newRow, newCol, this.board)) {
            console.log("suiside!")
            return false; 
        }
        
        // check if the piece belongs to the board 
        if (!this.board[piece.row][piece.col] === piece) { 
            return false; 
        }

        // check if the piece can move to the new position 
        if (!piece.validateMove(newRow, newCol, this.board)) { 
            return false; 
        }

        return true; 
    }

    findEnemies(color, board) {
        var enemies = []; 

        for (let i=0; i<=9; i++) {
            for (let j=0; j<=8; j++) {
                var piece = board[i][j]; 
                if (piece != null && piece.color == color) {
                    enemies.push(board[i][j]); 
                }
            }
        }

        return enemies; 
    }

    findGeneral(color, board) {
        var pos = []; 

        for (let i=0; i<=9; i++) {
            for (let j=0; j<=8; j++) {
                var piece = board[i][j]; 
                if (piece == null) continue; 
                if (piece.type == "general" && piece.color != color) {
                    pos[0] = i; pos[1] = j; break;  
                }
            }
        }

        return pos; 
    }

    isCheck(color, board) { // is our general being checked?
        var generalPos = this.findGeneral(color, board); 
        var enemies = this.findEnemies(color, board);  

        if (generalPos.length == 0) return; 
        for (var i = 0; i < enemies.length; i++) { 
            var enemy = enemies[i]; 
             
            if (enemy.validateMove(generalPos[0], generalPos[1], board)) { 
                return true; 
            } 
        }

        return false; // default result
    }

    isSuisideMove(piece, newRow, newCol, board) {
        var copy = this.copyBoard(board); 
        var col = piece.col; 
        var row = piece.row; 
        var color = (piece.color == "red") ? "black" : "red"; 

        copy[row][col] = null; 
        copy[newRow][newCol] = piece; 

        var flag = this.isCheck(color, copy); 
        
        return flag; 
    }

    copyBoard(board) {
        var copy = []; 

        for (let i=0; i<=9; i++) {
            copy[i] = []; 
            for (let j=0; j<=8; j++) {
                copy[i][j] = null; 
            }
        }
        
        for (let i=0; i<=9; i++) {
            for (let j=0; j<=8; j++) {
                copy[i][j] = board[i][j];
            }
        }

        return copy; 
    }

    getPossiblePos(piece) {
        var row = piece.row; 
        var col = piece.col; 
        var dir = piece.dir;
        var type = piece.type; 
        
        var possiblePos = []; 
        if (type == "cannon" || type == "chariot" || type == "horse") {
            for (let i=0; i<dir.length; i++) {
                var len = dir[i].length; 
                for (let j=0; j<len; j++) {
                    var rowChange = dir[i][j][0]; 
                    var colChange = dir[i][j][1]; 
                    
                    if (rowChange == 0 && colChange == 0) continue; 
                    possiblePos.push([row + rowChange, col + colChange]); 
                }
            }
        } else {
            for (let i=0; i<dir.length; i++) {
                var rowChange = dir[i][0]; 
                var colChange = dir[i][1]; 

                if (rowChange == 0 && colChange == 0) continue; 
                possiblePos.push([row + rowChange, col + colChange]); 
            }
        }

        return possiblePos; 
    }

    isCheckMate(color, board) {
        var enemies = this.findEnemies(color, board); 
        
        for (var i = 0; i < enemies.length; i++) { 
            var enemy = enemies[i]; 
            var possiblePos = this.getPossiblePos(enemy); 
            for (var j = 0; j < possiblePos.length; j++) { 
                var newRow = possiblePos[j][0]; 
                var newCol = possiblePos[j][1]; 

                if (newRow < 0 || newRow > 9) continue; 
                if (newCol < 0 || newCol > 8) continue; 
                if (!enemy.validateMove(newRow, newCol, board)) continue; 
                if (!this.isSuisideMove(enemy, newRow, newCol, board)) { 
                    console.log("Possible solution: "); 
                    console.log(enemy); 
                    console.log("at [" + enemy.row + ", " + enemy.col + "]"); 
                    console.log("to [" + possiblePos[j][0] + ", " + possiblePos[j][1] + "]"); 
                    return false; 
                } 
            } 
        }

        return true;
    }
}