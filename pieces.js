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
        
        console.log(board[newRow][newCol]); 

        return valid.some(([validRowChange, validColChange]) => { 
            return rowChange === validRowChange && colChange === validColChange; 
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
        var attackPos = []; 

        if (this.color == "red") {
            for (let i=this.row-1; i>=0; i--) {
                if (board[i][this.col] == null) {
                   continue;  
                } else if (board[i][this.col].type == "general") {
                    attackPos.push([i, this.col]); 
                    break; 
                } else {
                    return; // has obstacle
                }
            }
        }

        if (this.color == "black") {
            for (let i=this.row+1; i<=9; i++) {
                if (board[i][this.col] == null) {
                    continue; 
                }else if (board[i][this.col].type == "general") {
                    attackPos.push([i, this.col]); 
                    break; 
                } else {
                    return; // has obstacle
                }
            }
        }

        console.log("attacking general"); 
        console.log(board[attackPos[0][0]][attackPos[0][1]]);  
        console.log(newRow); 
        console.log(newCol); 

        return (newRow == attackPos[0][0] && newCol == attackPos[0][1]); 
    }

    validateMove(newRow, newCol, board) {
        if (this.validAttack(newRow, newCol, board)) return true; 

        var valid = [[0,1],[1,0],[-1,0],[0,-1]]; 

        if (newCol < 3) return false; // left limit
        if (newCol > 5) return false; // right limit
        if (this.color == "red" && newRow < 7) return false; // down limit
        if (this.color == "black" && newRow > 2) return false; // up limit

        return this.checkMove(newRow, newCol, valid, board); 
    }
}

export class Cannon extends ChessPiece { 
    constructor(id, color, icon, col, row) {
        super(id, color, "cannon", icon, col, row); 
    }

    rightLimit(board) {
        let right = 8; 
        for (let i=this.col+1; i<=8; i++) {
            if (board[this.row][i] != null) {
                right = i; 
                break; 
            }
        }

        return right; 
    }

    leftLimit(board) {
        let left = 0; 
        for (let i=this.col-1; i>=0; i--) {
            if (board[this.row][i] != null) {
                left = i; 
                break; 
            }
        }

        return left; 
    }

    downLimit(board) {
        let down = 9; 
        for (let i=this.row+1; i<=9; i++) {
            if (board[i][this.col] != null) {
                down = i; 
                break; 
            }
        }

        return down; 
    }

    upperLimit(board) { 
        let up = 0; 
        for (let i=this.row-1; i>=0; i--) {
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
            if (board[this.row][i] != null) {
                attackPos.push([this.col, i]); 
                break; 
            }
        }
        // attack right
        const right = this.rightLimit(board); 
        for (let i=right+1; i<=8; i++) {
            if (board[this.row][i] != null) {
                attackPos.push([this.row, i]); 
                break; 
            }
        }
        // attack up
        const up = this.upperLimit(board); 
        for (let i=up-1; i>=0; i--) {
            if (board[i][this.col] != null) {
                attackPos.push([i, this.col]); 
                break; 
            }
        }
        // attack down
        const down = this.downLimit(board); 
        for (let i=down+1; i<=9; i++) {
            if (board[i][this.col] != null) {
                attackPos.push([i, this.col]); 
                break; 
            }
        }
        console.log("carriage"); 
        console.log(board[this.row][left]); 
        console.log(board[this.row][right]); 
        console.log(board[up][this.col]);
        console.log(board[down][this.col]);  
        console.log("targets"); 
        for (let i=0; i<attackPos.length; i++) {
            console.log(board[attackPos[i][0]][attackPos[i][1]]); 
        }
        // check position 
        return attackPos.some(([row, col]) => { 
            return newRow === row && newCol === col; 
        });
    }

    validateMove(newRow, newCol, board) {
        let valid = []; 
        
        const up = (board[newRow][newCol] != null) ? this.upperLimit(board) + 1 : this.upperLimit(board); 
        for (let i=up; i<this.row; i++) {
            valid.push([i-this.row, 0]); 
        }
        const down = (board[newRow][newCol] != null) ? this.downLimit(board) - 1 : this.downLimit(board); 
        for (let i=down; i>this.row; i--) {
            valid.push([i-this.row, 0]); 
        }
        const left = (board[newRow][newCol] != null) ? this.leftLimit(board) + 1 : this.leftLimit(board); 
        for (let i=left; i<this.col; i++) {
            valid.push([0, i-this.col]); 
        }
        const right = (board[newRow][newCol] != null) ? this.rightLimit(board) - 1 : this.rightLimit(board);
        for (let i=right; i>this.col; i--) {
            valid.push([0, i-this.col]); 
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

        var curRow = this.row; 
        var curCol = this.col; 

        if (curRow-1>=0 && curCol-1>=0 && board[curRow-1][curCol-1] == null) { // left down
            valid.push([-2, -2]); 
        }
        if (curRow+1<=9 && curCol+1<=8 && board[curRow+1][curCol+1] == null) { // right up
            valid.push([2, 2]);
        }    
        if (curRow+1<=9 && curCol-1>=0 && board[curRow+1][curCol-1] == null) { // right down
            valid.push([2, -2]); 
        }
        if (curRow-1>=0 && curCol+1<=8 && board[curRow-1][curCol+1] == null) { // left up
            valid.push([-2, 2]); 
        }

        // check if the elephant crosses the river 
        if (this.color == "red" && newRow < 4) {
             return false; 
        } 
        if (this.color == "black" && newRow > 5) {
             return false; 
        }
        console.log("valid"); 
        console.log(valid); 

        return this.checkMove(newRow, newCol, valid, board); 
    } 
}

export class Chariot extends ChessPiece { 
    constructor(id, color, icon, col, row) {
        super(id, color, "chariot", icon, col, row); 
    }

    rightLimit(board) {
        let right = 8; 
        for (let i=this.col+1; i<=8; i++) {
            if (board[this.row][i] != null) {
                right = i; 
                break; 
            }
        }

        return right; 
    }

    leftLimit(board) {
        let left = 0; 
        for (let i=this.col-1; i>=0; i--) {
            if (board[this.row][i] != null) {
                left = i; 
                break; 
            }
        }

        return left; 
    }

    downLimit(board) {
        let down = 9; 
        for (let i=this.row+1; i<=9; i++) {
            if (board[i][this.col] != null) {
                down = i; 
                break; 
            }
        }

        return down; 
    }

    upperLimit(board) { 
        let up = 0; 
        for (let i=this.row-1; i>=0; i--) {
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
            valid.push([i-this.row, 0]); 
        }
        const down = this.downLimit(board); 
        for (let i=down; i>this.row; i--) {
            valid.push([i-this.row, 0]); 
        }
        const left = this.leftLimit(board); 
        for (let i=left; i<this.col; i++) {
            valid.push([0, i-this.col]); 
        }
        const right = this.rightLimit(board);
        for (let i=right; i>this.col; i--) {
            valid.push([0, i-this.col]); 
        }

        console.log("up: " + up);
        console.log("down: " + down);
        console.log("left: " + left);
        console.log("right: " + right);    

        return this.checkMove(newRow, newCol, valid, board); 
    }
}

export class Horse extends ChessPiece {
    constructor(id, color, icon, col, row) {
        super(id, color, "horse", icon, col, row); 
    }

    validateMove(newRow, newCol, board) { 
        let valid = []; 
        var curRow = this.row; 
        var curCol = this.col; 
        console.log("surrounding"); 
        
        if (curRow+1<=9 && board[curRow+1][curCol] == null) { // check down
            valid.push([2,1], [2,-1]); 
        }
        if (curCol+1<=8 && board[curRow][curCol+1] == null) { // check right
            valid.push([-1,2],[1,2]); 
        }
        if (curRow-1>=0 && board[curRow-1][curCol] == null) { // check up
            valid.push([-2,1],[-2,-1]); 
        }
        if (curCol-1>=0 && board[curRow][curCol-1] == null) { // check left
            valid.push([1,-2],[-1,-2]); 
        }

        console.log(valid); 
        return this.checkMove(newRow, newCol, valid, board); 
    }
}

export class Pawn extends ChessPiece { 
    constructor(id, color, icon, col, row) {
        super(id, color, "pawn", icon, col, row);
    }

    validateMove(newRow, newCol, board) {
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
