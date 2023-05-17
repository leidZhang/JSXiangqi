import { General, Chariot, Horse, Elephant, Advisor, Pawn, Cannon } from './pieces.js'; 

export class Board {
    constructor() {
        this.board = []; // 10 * 9 array
        this.status = true; // game start 
        this.curPiece = null; 
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
        this.board[4][9] = redGeneral; 
        this.board[3][9] = redAdvisor1; 
        this.board[5][9] = redAdvisor2; 
        this.board[2][9] = redElephant1; 
        this.board[6][9] = redElephant2; 
        this.board[1][9] = redHorse1; 
        this.board[7][9] = redHorse2; 
        this.board[0][9] = redChariot1; 
        this.board[8][9] = redChariot2; 
        this.board[1][7] = redCannon1; 
        this.board[7][7] = redCannon2;
        this.board[0][6] = redPawn1; 
        this.board[2][6] = redPawn2; 
        this.board[4][6] = redPawn3; 
        this.board[6][6] = redPawn4; 
        this.board[8][6] = redPawn5;
        // fill the board black side 
        this.board[4][0] = blackGeneral; 
        this.board[3][0] = blackAdvisor1; 
        this.board[5][0] = blackAdvisor2; 
        this.board[2][0] = blackElephant1; 
        this.board[6][0] = blackElephant2; 
        this.board[1][0] = blackHorse1; 
        this.board[7][0] = blackHorse2; 
        this.board[0][0] = blackChariot1; 
        this.board[8][0] = blackChariot2; 
        this.board[1][2] = blackCannon1; 
        this.board[7][2] = blackCannon2;
        this.board[0][3] = blackPawn1; 
        this.board[2][3] = blackPawn2; 
        this.board[4][3] = blackPawn3; 
        this.board[6][3] = blackPawn4; 
        this.board[8][3] = blackPawn5;
    } 

    recordMove(newCol, newRow) {
        return "[" + this.curPiece.row + "," + this.curPiece.col + "] -> [" + newRow + "," + newCol + "]"; 
    } 

    movePiece(piece, newRow, newCol) { 
        // check if the piece belongs to the board 
        if (!this.board[piece.row][piece.col] === piece) { 
            return "Invalid piece"; 
        }

        // check if the new position is within the board 
        if (newRow < 0 || newRow > 9 || newCol < 0 || newCol > 8) { 
            return "Invalid position"; 
        }
        
        // check if the piece can move to the new position 
        if (!piece.validateMove(newCol, newRow, this.board)) { 
            return "Invalid move"; 
        }
        
        // update the board 
        this.board[piece.row][piece.col] = null; 
        // remove the piece from the old position 
        this.board[newRow][newCol] = piece; 
        // place the piece on the new position 
        piece.row = newRow; // update the piece’s row 
        piece.col = newCol; // update the piece’s col
        
        return "Move successful"; 
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
        } else { 
            return true; // game is over 
        } 
    }
}