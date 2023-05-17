class ChessPiece {
    constructor(id, color, type, icon, col, row) {
        this.id = id; 
        this.color = color;
        this.icon = icon;
        this.type = type;
        this.col = col;
        this.row = row;
    }

    checkMove(newRow, newCol, valid, board) {
        const rowChange = newRow - this.row; 
        const colChange = newCol - this.col; // check position 
        console.log(valid); 

        return valid.some(([validRowChange, validColChange]) => { 
            console.log(rowChange); 
            console.log(validRowChange); 
            console.log(colChange); 
            console.log(validColChange); 

            console.log(rowChange === validRowChange); 
            console.log(colChange === validColChange); 
            console.log(board[newRow][newCol].getColor() != this.color); 
            return rowChange === validRowChange && colChange === validColChange && board[newRow][newCol].getColor() != this.color; 
        }); 
    }

    getId() {
        return this.id; 
    }

    getColor() {
        return this.color; 
    }
}

export class General extends ChessPiece {
    constructor(id, color, icon, col, row) {
        super(id, color, "general", icon, col, row); 
    }

    validAttack(newRow, newCol, board) {
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

    validateMove(newRow, newCol, board) {
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
    constructor(id, color, icon, col, row) {
        super(id, color, "cannon", icon, col, row); 
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

    validAttack(newRow, newCol, board) {
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

    validateMove(newRow, newCol, board) {
        let valid = []; 
        
        const up = this.upperLimit(board) + 1; 
        for (let i=up; i<this.row; i++) {
            valid.push([i, this.col]); 
        }
        const down = this.downLimit(board) - 1; 
        for (let i=down; i>this.row; i--) {
            valid.push([i, this.col]); 
        }
        const left = this.leftLimit(board) + 1; 
        for (let i=left; i<this.col; i++) {
            valid.push([this.row, i]); 
        }
        const right = this.rightLimit(board) - 1;
        for (let i=right; i>this.col; i--) {
            valid.push([this.row, i]); 
        }

        return this.checkMove(newRow, newCol, valid, board) || this.validAttack(newRow, newCol, board);
    }
}

export class Advisor extends ChessPiece {
    constructor(id, color, icon, col, row) {
        super(id, color, "advisor", icon, col, row); 
    }

    validateMove(newRow, newCol, board) {
        let valid = [[1,1],[1,-1],[-1,1],[-1,-1]]; 
        
        if (newCol < 3) return false; // left limit
        if (newCol > 5) return false; // right limit
        if (this.color == "red" && newRow < 7) return false; // down limit
        if (this.color == "black" && newRow > 2) return false; // up limit

        return this.checkMove(newRow, newCol, valid, board); 
    }
}

export class Elephant extends ChessPiece {
    constructor(id, color, icon, col, row) {
        super(id, color, "elephant", icon, col, row); 
    }

    validateMove(newRow, newCol, board) {
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

        return this.checkMove(newRow, newCol, valid, board); 
    } 
}

export class Chariot extends ChessPiece {
    constructor(id, color, icon, col, row) {
        super(id, color, "chariot", icon, col, row); 
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

    validateMove(newRow, newCol, board) {
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

        return this.checkMove(newRow, newCol, valid, board); 
    }
}

export class Horse extends ChessPiece {
    constructor(id, color, icon, col, row) {
        super(id, color, "horse", icon, col, row); 
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

        return this.checkMove(newRow, newCol, valid, board); 
    }
}

export class Pawn extends ChessPiece {
    constructor(id, color, icon, col, row) {
        super(id, color, "pawn", icon, col, row);
    }

    validateMove(newCol, newRow, board) {
        let valid = []; 

        if (this.color === "black") { 
            valid.push([1, 0]);
            if (this.row >= 5) {
                valid.push([0, -1], [0, 1]);
            }
        } 
        
        if (this.color === "red") {
            valid.push([-1, 0]); 
            if (this.row <= 4) {
                valid.push([0, -1], [0, 1]);
            }
        }
        
        return this.checkMove(newRow, newCol, valid, board); 
    }
}
