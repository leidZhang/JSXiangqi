export class Record {
    constructor(prevRow, prevCol, newRow, newCol, movePiece, killedPiece) {
        this.prevRow = prevRow; 
        this.prevCol = prevCol; 
        this.newRow = newRow; 
        this.newCol = newCol; 
        this.movePiece = movePiece; 
        this.killedPiece = killedPiece; 
    }

    proceedMove() {
        // impl procced
    }

    retractMove() {
        // impl retract
    }
}