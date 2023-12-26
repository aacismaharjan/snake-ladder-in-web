
class Player {
    constructor(index, name, piece, button, position) {
        this.index = index;
        this.name = name;
        this.piece = piece;
        this.button = button;
        this.position = position;
    }

    getIndex() {
        return this.index;
    }

    getName() {
        return this.name;
    }

    getPiece() {
        return this.piece;
    }

    getButton() {
        return this.button;
    }

    getPosition() {
        return this.position;
    }

    setIndex(index) {
        this.index = index;
    }

    setname(name) {
        this.name = name;
    }

    setPiece(piece) {
        this.piece = piece;
    }

    setButton(button) {
        this.button = button;
    }

    setPosition(position) {
        this.position = position;
    }

    updatePosition() {
        if (this.position > 100) return;

        // Check if the position indicator is 0
        if (this.position === 0) {
            // Set the vertical position of the player element
            this.piece.style.bottom = "-70px";
            // Set the horizontal position based on player type
            this.piece.style.left = `${this.index * 50}px`;
        } else {
            if (this.position % 10 !== 0) {
                this.piece.style.bottom = parseInt(this.position / 10) * 50 + "px";
            } else {
                this.piece.style.bottom = (parseInt(this.position / 10) - 1) * 50 + "px";
            }

            if ((this.position >= 1 && this.position < 10) || this.position >= 21 && this.position < 30 || this.position >= 41 && this.position < 50 || this.position >= 61 && this.position < 70 || this.position >= 81 && this.position < 90) {
                this.piece.style.left = (parseInt(this.position % 10) * 50 - 50) + "px";
            } else {

                if (parseInt(this.position % 20) === 0) {
                    this.piece.style.left = "0px";
                } else if (parseInt(this.position % 20) !== 0 && parseInt(this.position % 10) === 0) {
                    this.piece.style.left = "450px";
                } else {

                    this.piece.style.left = (500 - parseInt(this.position % 10) * 50) + "px";
                }
            }

        }
    }
    
}