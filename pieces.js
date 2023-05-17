class ChessPiece {
    constructor(color, type, icon, col, row) {
        this.color = color;
        this.icon = icon;
        this.type = type;
        this.col = col;
        this.row = row;
    }

    checkMove(newCol, newRow, valid, board) {
        const rowChange = newRow - this.row; 
        const colChange = newCol - this.col; // check position 

        return valid.some(([validRowChange, validColChange]) => { 
            return rowChange === validRowChange && colChange === validColChange && board[newRow][newCol].getColor() != this.color; 
        }); 
    }

    recordMove(newCol, newRow) {
        return "["+this.row + "," + this.col + "] -> [" + newRow + "," + newCol + "]"; 
    } 

    getColor() {
        return this.color; 
    }
}

export class General extends ChessPiece {
    constructor(color, icon, col, row) {
        super(color, "cannon", icon, col, row); 
    }

    validAttack(newCol, newRow, board) {
        attackPos = []; 

        if (this.color == "red") {
            for (let i=this.row-1; i>=0; i--) {
                if (board[i][this.col] == null) continue; 
                if (board[i][this.col].type == "general") {
                    attackPos.push([i, this.col]); 
                    break; 
                } else {
                    break; 
                }
            }
        }

        if (this.color == "black") {
            for (let i=this.row+1; i<=9; i++) {
                if (board[i][this.col] == null) continue; 
                if (board[i][this.col].type == "general") {
                    attackPos.push([i, this.col]); 
                    break; 
                } else {
                    break; 
                }
            }
        }

        return (newRow == attackPos[0] && newCol == attackPos[1]); 
    }

    validMove(newCol, newRow, board) {
        if (this.validAttack(newCol, newRow, board)) return true; // general attack general

        valid = [[0,1],[1,0],[-1,0],[0,-1]]; 

        if (newCol < 3) return false; // left limit
        if (newCol > 5) return false; // right limit
        if (this.color == "red" && newRow < 7) return false; // down limit
        if (this.color == "black" && newRow > 2) return false; // up limit

        return attackPos.some(([row, col]) => {
            return newRow === row && newCol === col; 
        });
    }
}

export class Cannon extends ChessPiece {
    constructor(color, icon, col, row) {
        super(color, "cannon", icon, col, row); 
    }

    rightLimit(board) {
        let right = 8; 
        for (let i=this.col; i<=8; i++) {
            if (board[this.row][i] != null) {
                right = i; 
                break; 
            }
        }

        return right; 
    }

    leftLimit(board) {
        let left = 0; 
        for (let i=this.col; i>=0; i--) {
            if (board[this.row][i] != null) {
                left = i; 
                break; 
            }
        }

        return left; 
    }

    downLimit(board) {
        let down = 9; 
        for (let i=this.row; i<=9; i++) {
            if (board[i][this.col] != null) {
                down = i; 
                break; 
            }
        }

        return down; 
    }

    upperLimit(board) { 
        let up = 0; 
        for (let i=this.row; i>=0; i--) {
            if (board[i][this.col] != null) {
                up = i; 
                break; 
            }
        }

        return up; 
    }

    validAttack(newCol, newRow, board) {
        let attackPos = []; 
        // attack left
        const left = this.leftLimit(board); 
        for (let i=left-1; i>=0; i--) {
            if (board[i][this.col] != null) {
                attackPos.push([i, this.col]); 
                break; 
            }
        }
        // attack right
        const right = this.rightLimit(board); 
        for (let i=right+1; i<=8; i++) {
            if (board[i][this.col] != null) {
                attackPos.push([i, this.col]); 
                break; 
            }
        }
        // attack up
        const up = this.upperLimit(board); 
        for (let i=up-1; i>=0; i--) {
            if (board[this.row][i] != null) {
                attackPos.push([this.row, i]); 
                break; 
            }
        }
        // attack down
        const down = this.downLimit(board); 
        for (let i=down+1; i<=9; i++) {
            if (board[this.row][i] != null) {
                attackPos.push([this.row, i]); 
                break; 
            }
        }

        // check position 
        return attackPos.some(([row, col]) => { 
            return newRow === row && newCol === col && board[newRow][newCol].getColor() != this.color; 
        });
    }

    validMove(newCol, newRow, board) {
        let valid = []; 
        
        const up = this.upperLimit(board); 
        for (let i=up; i<this.row; i++) {
            valid.push([i-1, this.col]); 
        }
        const down = this.downLimit(board); 
        for (let i=down; i>this.row; i--) {
            valid.push([i+1, this.col]); 
        }
        const left = this.leftLimit(board); 
        for (let i=left; i<this.col; i++) {
            valid.push([this.row, i-1]); 
        }
        const right = this.rightLimit(board);
        for (let i=right; i>this.col; i--) {
            valid.push([this.row, i+1]); 
        }

        return this.checkMove(newCol, newRow, valid, board) || this.validAttack(newCol, newRow, board);
    }
}

export class Advisor extends ChessPiece {
    constructor(color, icon, col, row) {
        super(color, "advisor", icon, col, row); 
    }

    validateMove(newCol, newRow, board) {
        let valid = [[1,1],[1,-1],[-1,1],[-1,-1]]; 
        
        if (newCol < 3) return false; // left limit
        if (newCol > 5) return false; // right limit
        if (this.color == "red" && newRow < 7) return false; // down limit
        if (this.color == "black" && newRow > 2) return false; // up limit

        return this.checkMove(newCol, newRow, valid, board); 
    }
}

export class Elephant extends ChessPiece {
    constructor(color, icon, col, row) {
        super(color, "elephant", icon, col, row); 
    }

    validateMove(newCol, newRow, board) {
        let valid = []; 

        if (board[this.row-1][this.col-1] == null) { // left down
            valid.push([this.row-2, this.col-2]); 
        }
        if (board[this.row+1][this.col+1] == null) { // right up
            valid.push([this.row+2, this.col+2]);
        }    
        if (board[this.row+1][this.col-1] == null) { // right down
            valid.push([this.row+2, this.col-2]); 
        }
        if (board[this.row-1][this.col+1] == null) { // left up
            valid.push([this.row-2, this.col+2]); 
        }

        // check if the elephant crosses the river 
        if (this.color == "red" && newRow > 4) {
             return false; 
        } 
        if (this.color == "black" && newRow < 5) {
             return false; 
        }

        return this.checkMove(newCol, newRow, valid, board); 
    } 
}

export class Chariot extends ChessPiece {
    constructor(color, icon, col, row) {
        super(color, "chariot", icon, col, row); 
    }

    rightLimit(board) {
        let right = 8; 
        for (let i=this.col; i<=8; i++) {
            if (board[this.row][i] != null) {
                right = i; 
                break; 
            }
        }

        return right; 
    }

    leftLimit(board) {
        let left = 0; 
        for (let i=this.col; i>=0; i--) {
            if (board[this.row][i] != null) {
                left = i; 
                break; 
            }
        }

        return left; 
    }

    downLimit(board) {
        let down = 9; 
        for (let i=this.row; i<=9; i++) {
            if (board[i][this.col] != null) {
                down = i; 
                break; 
            }
        }

        return down; 
    }

    upperLimit(board) { 
        let up = 0; 
        for (let i=this.row; i>=0; i--) {
            if (board[i][this.col] != null) {
                up = i; 
                break; 
            }
        }

        return up; 
    }

    validateMove(newCol, newRow, board) {
        let valid = []; 
        
        const up = this.upperLimit(board); 
        for (let i=up; i<this.row; i++) {
            valid.push([i, this.col]); 
        }
        const down = this.downLimit(board); 
        for (let i=down; i>this.row; i--) {
            valid.push([i, this.col]); 
        }
        const left = this.leftLimit(board); 
        for (let i=left; i<this.col; i++) {
            valid.push([this.row, i]); 
        }
        const right = this.rightLimit(board);
        for (let i=right; i>this.col; i--) {
            valid.push([this.row, i]); 
        }

        return this.checkMove(newCol, newRow, valid, board); 
    }
}

export class Horse extends ChessPiece {
    constructor(color, icon, col, row) {
        super(color, "horse", icon, col, row); 
    }

    validateMove(newCol, newRow, board) {
        let valid = []; 

        if (board[this.col + 1][this.row] != null) { // check right
            valid.push([2,1], [2,-1]); 
        }
        if (board[this.col][this.row + 1] != null) { // check up
            valid.push([1,-2],[1,2]); 
        }
        if (board[this.col - 1][this.row] != null) { // chek left 
            valid.push([-2,1],[-2,-1]); 
        }
        if (board[this.col][this.row - 1] != null) { // check down
            valid.push([-1,2],[-1,-2]); 
        }

        return this.checkMove(newCol, newRow, valid, board); 
    }
}

export class Pawn extends ChessPiece {
    constructor(color, icon, col, row) {
        super(color, "pawn", icon, col, row);
    }

    validateMove(newCol, newRow, board) {
        let valid = []; 

        if (this.color === "red") { 
            valid.push([0, 1]);
            if (this.row >= 5) {
                valid.push([-1, 0], [1, 0]);
            }
        } else {
            valid[0] = [[0,-1]]; 
            if (this.row <= 4) {
                valid.push([-1, 0], [1, 0]);
            }
        }

        return this.checkMove(newCol, newRow, valid, board); 
    }
}
