class ChessPiece {
    constructor(id, color, type, icon, col, row) {
        this.id = id; 
        this.color = color;
        this.icon = icon;
        this.type = type;
        this.col = col;
        this.row = row;
    }

    isFriendly(newRow, newCol, board) {
        var unknown = board[newRow][newCol]; 
        if (unknown != null && unknown.color == this.color) {
            return true; 
        }

        return false; 
    }

    checkMove(newRow, newCol, valid, board) {
        if (this.isFriendly(newRow, newCol, board)) return false; 

        const rowChange = newRow - this.row; 
        const colChange = newCol - this.col; // check position 

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
        this.dir = [[1,0], [-1,0], [0,1], [0,-1], [0,0]]; // dir[4] is the attack movement
    }
    
    findColTgt(color, board) {
        if (color == "black") {
            for (let i=this.row+1; i<=9; i++) {
                if (board[i][this.col] == null) continue; 
                if (board[i][this.col].type != "general") break; 

                return [i-this.row, 0]; 
            }
        } else {
            for (let i=this.row-1; i>=0; i--) {
                if (board[i][this.col] == null) continue; 
                if (board[i][this.col].type != "general") break; 

                return [i-this.row, 0]; 
            }
        }

        return null; 
    }
    
    validateMove(newRow, newCol, board) {
        var valid = []; 

        if (this.col != 3) valid.push(this.dir[3]); // [0, -1]
        if (this.col != 5) valid.push(this.dir[2]); // [0,1]
        if (this.color == "black") {
            if (this.row != 0) valid.push(this.dir[1]); // [-1,0]
            if (this.row != 2) valid.push(this.dir[0]); // [1,0]
            var tgt = this.findColTgt("black", board); 
            if (tgt != null) {
                valid.push(tgt); 
                this.dir[4] = tgt; 
            } else {
                this.dir[4] = [0,0]; 
            }
        } else {
            if (this.row != 7) valid.push(this.dir[1]); //[-1,0]
            if (this.row != 9) valid.push(this.dir[0]); //[1,0]
            var tgt = this.findColTgt("red", board); 
            if (tgt != null) {
                valid.push(tgt); 
                this.dir[4] = tgt; 
            } else {
                this.dir[4] = [0,0]; 
            }
        }

        return this.checkMove(newRow, newCol, valid, board); 
    }
}

export class Chariot extends ChessPiece { 
    constructor(id, color, icon, col, row) {
        super(id, color, "chariot", icon, col, row); 
        this.dir = [[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
                    [[-1,0],[-2,0],[-3,0],[-4,0],[-5,0],[-6,0],[-7,0],[-8,0],[-9,0]],
                    [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8]],
                    [[0,-1],[0,-2],[0,-3],[0,-4],[0,-5],[0,-6],[0,-7],[0,-8]]   
                ]; 
    }

    rowLimit(side, board) {
        var dirRow = (side == "up") ? 1 : 0; // dir[0] up, dir[1] down
        var limit = -1; 

        for (let i=0; i<9; i++) {
            var newRow = this.row + this.dir[dirRow][i][0]; 
            if (newRow < 0 || newRow > 9) break; 

            limit++; 
            if (newRow >= 0 && newRow <= 9 && board[newRow][this.col] != null) {
                break; 
            }

        }

        return limit; 
    }

    colLimit(side, board) {
        var dirCol = (side == "right") ? 2 : 3; 
        var limit = -1; 
            
        for (let i=0; i<8; i++) {
            var newCol = this.col + this.dir[dirCol][i][1]; 
            if (newCol < 0 || newCol > 8) break; 

            limit++; 
            if (newCol >= 0 && newCol <= 8 && board[this.row][newCol] != null) {
                break; 
            }
        }
            
        return limit; 
    }

    validateMove(newRow, newCol, board) {
        let valid = []; 
        
        const up = this.rowLimit("up", board); 
        for (let i=0; i<=up; i++) {
            valid.push(this.dir[1][i]); 
        }
        const down = this.rowLimit("down", board); 
        for (let i=0; i<=down; i++) {
            valid.push(this.dir[0][i]); 
        }
        const right = this.colLimit("right", board);
        for (let i=0; i<=right; i++) {
            valid.push(this.dir[2][i]); 
        }
        const left = this.colLimit("left", board); 
        for (let i=0; i<=left; i++) {
            valid.push(this.dir[3][i]); 
        }

        return this.checkMove(newRow, newCol, valid, board); 
    }
}

export class Cannon extends ChessPiece { 
    constructor(id, color, icon, col, row) {
        super(id, color, "cannon", icon, col, row); 
        this.dir = [[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]], // down
                    [[-1,0],[-2,0],[-3,0],[-4,0],[-5,0],[-6,0],[-7,0],[-8,0],[-9,0]], // up
                    [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8]], // right
                    [[0,-1],[0,-2],[0,-3],[0,-4],[0,-5],[0,-6],[0,-7],[0,-8]], // left
                    [[0,0],[0,0],[0,0],[0,0]]  // attack
                ]; 
    }

    rowLimit(side, board) {
        var dirRow = (side == "up") ? 1 : 0; // dir[0] up, dir[1] down
        var limit = -1; 

        for (let i=0; i<9; i++) {
            var newRow = this.row + this.dir[dirRow][i][0]; 
            if (newRow < 0 || newRow > 9) break; 

            limit++; 
            if (newRow >= 0 && newRow <= 9 && board[newRow][this.col] != null) {
                break; 
            }
        }

        return limit; 
    }

    colLimit(side, board) {
        var dirCol = (side == "right") ? 2 : 3; 
        var limit = -1; 
            
        for (let i=0; i<8; i++) {
            var newCol = this.col + this.dir[dirCol][i][1]; 
            if (newCol < 0 || newCol > 8) break; 

            limit++; 
            if (newCol >= 0 && newCol <= 8 && board[this.row][newCol] != null) {
                break; 
            }
        }
            
        return limit; 
    }

    findRowTgt(side, board, rowLimit) {
        const rowDir = (side == "up") ? 1 : 0; 

        for (let i=rowLimit+1; i<9; i++) {
            var newRow = this.row + this.dir[rowDir][i][0]; 

            if (newRow >= 0 && newRow <= 9 && board[newRow][this.col] != null) {
                return this.dir[rowDir][i]; 
            }
        }

        return null; 
    }

    findColTgt(side, board, colLimit) {
        const colDir = (side == "right") ? 2 : 3; 

        for (let i=colLimit+1; i<7; i++) {
            var newCol = this.col + this.dir[colDir][i][1]; 
            if (newCol >= 0 && newCol <= 8 && board[this.row][newCol] != null) {
                return this.dir[colDir][i]; 
            }
        }

        return null;
    }

    validateMove(newRow, newCol, board) {
        let valid = []; 
        
        const up = this.rowLimit("up", board); 
        const upBlock = (board[newRow][newCol] != null) ? up - 1 : up; 
        for (let i=0; i<=upBlock; i++) valid.push(this.dir[1][i]); 
        const upTgt = this.findRowTgt("up", board, up); 
        if (upTgt != null) {
            valid.push(upTgt); 
            this.dir[4][0] = upTgt; 
        } else {
            this.dir[4][0] = [0,0]; 
        }
        
        const down = this.rowLimit("down", board); 
        const downBlock = (board[newRow][newCol] != null) ? down - 1 : down; 
        for (let i=0; i<=downBlock; i++) valid.push(this.dir[0][i]); 
        const downTgt = this.findRowTgt("down", board, down); 
        if (downTgt != null) {
            valid.push(downTgt); 
            this.dir[4][1] = downTgt; 
        } else {
            this.dir[4][1] = [0,0]; 
        }

        const right = this.colLimit("right", board);
        const rightBlock = (board[newRow][newCol] != null) ? right - 1 : right;
        for (let i=0; i<=rightBlock; i++) valid.push(this.dir[2][i]); 
        const rightTgt = this.findColTgt("right", board, right); 
        if (rightTgt != null) {
            valid.push(rightTgt); 
            this.dir[4][2] = rightTgt; 
        } else {
            this.dir[4][2] = [0,0]; 
        }

        const left = this.colLimit("left", board); 
        const leftBlock = (board[newRow][newCol] != null) ? left - 1 : left; 
        for (let i=0; i<=leftBlock; i++) valid.push(this.dir[3][i]); 
        const leftTgt = this.findColTgt("left", board, left); 
        if (leftTgt != null) {
            valid.push(leftTgt); 
            this.dir[4][3] = leftTgt; 
        } else {
            this.dir[4][3] = [0,0]; 
        }
 
        // return this.validAttack(newRow, newCol, board); 
        return this.checkMove(newRow, newCol, valid, board);
    }
}

export class Advisor extends ChessPiece { 
    constructor(id, color, icon, col, row) {
        super(id, color, "advisor", icon, col, row); 
        this.dir = [[1,1],[1,-1],[-1,1],[-1,-1]]; 
    }

    validateMove(newRow, newCol, board) {
        let valid = []; 

        if (this.color == "black") {
            if (this.row == 0 && this.col == 3) valid.push(this.dir[0]); // down right [1,1]
            else if (this.row == 0 && this.col == 5) valid.push(this.dir[1]); // down left [1,-1]
            else if (this.row == 2 && this.col == 3) valid.push(this.dir[2]); // up right [-1,1]
            else if (this.row == 2 && this.col == 5) valid.push(this.dir[3]); // up left [-1,-1]
            else valid.push([1,1], [1,-1], [-1,1], [-1,-1]); 
        } else {
            if (this.row == 7 && this.col == 3) valid.push(this.dir[0]); // down right [1,1]
            else if (this.row == 7 && this.col == 5) valid.push(this.dir[1]); // down left [1,-1]
            else if (this.row == 9 && this.col == 3) valid.push(this.dir[2]); // up right [-1,1]
            else if (this.row == 9 && this.col == 5) valid.push(this.dir[3]); // up left [-1,-1]
            else valid.push([1,1], [1,-1], [-1,1], [-1,-1]); 
        }

        return this.checkMove(newRow, newCol, valid, board); 
    }
}

export class Elephant extends ChessPiece {
    constructor(id, color, icon, col, row) {
        super(id, color, "elephant", icon, col, row); 
        this.dir = [[-2,-2],[2,2],[2,-2],[-2,2]]; 
    }

    validateMove(newRow, newCol, board) {
        let valid = []; 

        var curRow = this.row; 
        var curCol = this.col; 

        if (curRow-1>=0 && curCol-1>=0 && board[curRow-1][curCol-1] == null) { // left down
            valid.push(this.dir[0]); 
        }
        if (curRow+1<=9 && curCol+1<=8 && board[curRow+1][curCol+1] == null) { // right up
            valid.push(this.dir[1]);
        }    
        if (curRow+1<=9 && curCol-1>=0 && board[curRow+1][curCol-1] == null) { // right down
            valid.push(this.dir[2]); 
        }
        if (curRow-1>=0 && curCol+1<=8 && board[curRow-1][curCol+1] == null) { // left up
            valid.push(this.dir[3]); 
        }

        // check if the elephant crosses the river 
        if (this.color == "red" && newRow < 4) {
             return false; 
        } 
        if (this.color == "black" && newRow > 5) {
             return false; 
        }

        return this.checkMove(newRow, newCol, valid, board); 
    } 
}

export class Horse extends ChessPiece {
    constructor(id, color, icon, col, row) {
        super(id, color, "horse", icon, col, row); 
        this.dir = [[[2,1],[2,-1]],
                    [[-1,2],[1,2]],
                    [[-2,1],[-2,-1]],
                    [[1,-2],[-1,-2]]
                   ]
    }

    validateMove(newRow, newCol, board) { 
        let valid = []; 
        var curRow = this.row; 
        var curCol = this.col; 
        
        if (curRow+1<=9 && board[curRow+1][curCol] == null) { // check down
            valid.push(this.dir[0][0], this.dir[0][1]); 
        }
        if (curCol+1<=8 && board[curRow][curCol+1] == null) { // check right
            valid.push(this.dir[1][0], this.dir[1][1]); 
        }
        if (curRow-1>=0 && board[curRow-1][curCol] == null) { // check up
            valid.push(this.dir[2][0], this.dir[2][1]); 
        }
        if (curCol-1>=0 && board[curRow][curCol-1] == null) { // check left
            valid.push(this.dir[3][0], this.dir[3][1]); 
        }

        return this.checkMove(newRow, newCol, valid, board); 
    }
}

export class Pawn extends ChessPiece { 
    constructor(id, color, icon, col, row) {
        super(id, color, "pawn", icon, col, row);
        if (color == "black") {
            this.dir = [[1,0],[0,0],[0,0]]; 
        } else {
            this.dir = [[-1,0],[0,0],[0,0]];
        }
    }

    validateMove(newRow, newCol, board) {
        let valid = []; 

        valid.push(this.dir[0]);
        if (this.color === "black") { 
            if (this.row >= 5) {
                valid.push([0,-1], [0,1]);
                this.dir[1] = [0,-1]; 
                this.dir[2] = [0,1]; 
            }
        } 
        
        if (this.color === "red") {
            if (this.row <= 4) {
                valid.push([0,-1], [0,1]);
                this.dir[1] = [0,-1]; 
                this.dir[2] = [0,1]; 
            }
        }
        
        return this.checkMove(newRow, newCol, valid, board); 
    }
}
