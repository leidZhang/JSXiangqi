import { General, Chariot, Horse, Elephant, Advisor, Pawn, Cannon } from './pieces.js'; 

export class Board {
    constructor() {
        this.board = []; // 10 * 9 array
        this.turn = "red"; 
        this.status = true; // game start 
        this.curPiece = null; 
        this.turnCnt = 0; 
    }

    initBoard() {
        // create red pieces 
        let redChariot1 = new Chariot(1, "red", "车", 0, 9); 
        let redHorse1 = new Horse(2, "red", "马", 1, 9); 
        let redElephant1 = new Elephant(3, "red", "相", 2, 9); 
        let redAdvisor1 = new Advisor(4, "red", "仕", 3, 9); 
        let redGeneral = new General(5, "red", "帅", 4, 9); 
        let redAdvisor2 = new Advisor(6, "red", "仕", 5, 9); 
        let redElephant2 = new Elephant(7, "red", "相", 6, 9); 
        let redHorse2 = new Horse(8, "red", "马", 7, 9); 
        let redChariot2 = new Chariot(9, "red", "车", 8, 9); 
        let redCannon1 = new Cannon(10, "red", "炮", 1, 7); 
        let redCannon2 = new Cannon(11, "red", "炮", 7, 7); 
        let redPawn1 = new Pawn(12, "red", "兵", 0, 6); 
        let redPawn2 = new Pawn(13, "red", "兵", 2, 6); 
        let redPawn3 = new Pawn(14, "red", "兵", 4, 6); 
        let redPawn4 = new Pawn(15, "red", "兵", 6, 6); 
        let redPawn5 = new Pawn(16, "red", "兵", 8, 6); 
        // create black pieces 
        let blackChariot1 = new Chariot(17, "black", "車", 0, 0); 
        let blackHorse1 = new Horse(18, "black", "馬", 1, 0); 
        let blackElephant1 = new Elephant(19, "black", "象", 2, 0); 
        let blackAdvisor1 = new Advisor(20, "black", "士", 3, 0); 
        let blackGeneral = new General(21, "black", "将", 4, 0); 
        let blackAdvisor2 = new Advisor(22, "black", "士", 5, 0); 
        let blackElephant2 = new Elephant(23, "black", "象", 6, 0); 
        let blackHorse2 = new Horse(24, "black", "馬", 7, 0); 
        let blackChariot2 = new Chariot(25, "black", "車", 8, 0); 
        let blackCannon1 = new Cannon(26, "black", "砲", 1, 2); 
        let blackCannon2 = new Cannon(27, "black", "砲", 7, 2); 
        let blackPawn1 = new Pawn(28, "black", "卒", 0, 3); 
        let blackPawn2 = new Pawn(29, "black", "卒", 2, 3); 
        let blackPawn3 = new Pawn(30, "black", "卒", 4, 3); 
        let blackPawn4 = new Pawn(31, "black", "卒", 6, 3); 
        let blackPawn5 = new Pawn(32, "black", "卒", 8, 3); 

        // generate board
        for (let i=0; i<10; i++) { 
            this.board[i] = []; // create a row 
            for (let j=0; j<9; j++) { 
                this.board[i][j] = null; // create an empty slot 
            }
        }

        // fill the board red side
        this.board[9][4] = redGeneral; 
        this.board[9][3] = redAdvisor1; 
        this.board[9][5] = redAdvisor2; 
        this.board[9][2] = redElephant1; 
        this.board[9][6] = redElephant2; 
        this.board[9][1] = redHorse1; 
        this.board[9][7] = redHorse2; 
        this.board[9][0] = redChariot1; 
        this.board[9][8] = redChariot2; 
        this.board[7][1] = redCannon1; 
        this.board[7][7] = redCannon2;
        this.board[6][0] = redPawn1; 
        this.board[6][2] = redPawn2; 
        this.board[6][4] = redPawn3; 
        this.board[6][6] = redPawn4; 
        this.board[6][8] = redPawn5;
        // fill the board black side 
        this.board[0][4] = blackGeneral; 
        this.board[0][3] = blackAdvisor1; 
        this.board[0][5] = blackAdvisor2; 
        this.board[0][2] = blackElephant1; 
        this.board[0][6] = blackElephant2; 
        this.board[0][1] = blackHorse1; 
        this.board[0][7] = blackHorse2; 
        this.board[0][0] = blackChariot1; 
        this.board[0][8] = blackChariot2; 
        this.board[2][1] = blackCannon1; 
        this.board[2][7] = blackCannon2;
        this.board[3][0] = blackPawn1; 
        this.board[3][2] = blackPawn2; 
        this.board[3][4] = blackPawn3; 
        this.board[3][6] = blackPawn4; 
        this.board[3][8] = blackPawn5;
    } 

    movePiece(piece, newRow, newCol) { 
        // check if suiside
        if (this.isSuisideMove(piece, newRow, newCol, this.board)) {
            console.log("suiside!")
            return false; 
        }

        // check if attacking the friendly
        if (this.board[newRow][newCol] != null && this.board[newRow][newCol].color == piece.color) {
            return false; 
        }
        
        // check if the piece belongs to the board 
        if (!this.board[piece.row][piece.col] === piece) { 
            return false; 
        }

        // check if the new position is within the board 
        if (newRow < 0 || newRow > 9 || newCol < 0 || newCol > 8) { 
            return false; 
        }

        // check if the piece can move to the new position 
        if (!piece.validateMove(newRow, newCol, this.board)) { 
            return false; 
        }

        return true; 
    }

    isCheck(color, board) { // is our general being checked?
        var general = this.findGeneral(color, board); 
        var enemies = this.findEnemies(color, board);  

        if (general == null) return; 
        for (var i = 0; i < enemies.length; i++) { 
            var enemy = enemies[i]; 
            if (enemy.type != "cannon" && enemy.validateMove(general.row, general.col, board)) { 
                return true; 
            } 
            // cannon cannot attack the target directly 
            if (enemy.type == "cannon" && enemy.validAttack(general.row, general.col, board)) {
                return true; 
            }
        }

        return false; // default result
    }

    findEnemies(color, board) {
        var enemies = []; 

        for (let i=0; i<=9; i++) {
            for (let j=0; j<=8; j++) {
                var piece = board[i][j]; 
                if (piece == null) continue; 
                if (piece.color == color) {
                    enemies.push(board[i][j]); 
                }
            }
        }

        return enemies; 
    }

    findGeneral(color, board) {
        for (let i=0; i<=9; i++) {
            for (let j=0; j<=8; j++) {
                var piece = board[i][j]; 
                if (piece == null) continue; 
                if (piece.type == "general" && piece.color != color) {
                    return piece; 
                }
            }
        }

        return null; 
    }

    isSuisideMove(piece, newRow, newCol, board) {
        var copy = this.copyBoard(board); 
        var col = piece.col; 
        var row = piece.row; 
        var color = (piece.color == "red") ? "black" : "red"; 

        copy[row][col] = null; 
        copy[newRow][newCol] = piece; 

        var flag = this.isCheck(color, copy); 
        console.log(copy); 
        
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

    isCheckMate() {
        var enemies = this.findEnemies(color, board); 

        for (var i = 0; i < enemies.length; i++) { 
            var enemy = enemies[i]; 
            var validPos = enemy.getValidPos(board); 
            for (var j = 0; j < valid.length; j++) { 
                if (!this.isSuisideMove(enemy, validPos[j][0], validPos[j][1], board)) { 
                    return false; 
                } 
            } 
        }

        return true;
    }

    isGameOver() { 
        // find the red general 
        let redGeneral = null; 
        for (let i=7; i<=9; i++) { 
            for (let j=3; j<=5; j++) { 
                if (this.board[i][j] != null && this.board[i][j].type == "general" && this.board[i][j].color == "red") { 
                    redGeneral = this.board[i][j]; break;
                } 
            } 
        }
        // find the black general 
        let blackGeneral = null; 
        for (let i=0; i<=2; i++) { 
            for (let j=3; j<=5; j++) { 
                if (this.board[i][j] != null && this.board[i][j].type == "general" && this.board[i][j].color == "black") { 
                    blackGeneral = this.board[i][j]; break; 
                } 
            } 
        }

        // check if both generals are still on the board 
        if (redGeneral != null && blackGeneral != null) {
             return false; // game is not over 
        }  
        return true; // game is over 
    }
}