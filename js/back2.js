class GameBoard {
    constructor() {
        this.diceImagePositions = [380, 318, 256, 195, 133, 71];
        this.players = {};
        this.playerPositions = {};
        this.currentPlayerTurn = 0;
        this.numberOfPlayers = 0;
        this.SNAKES_AND_LADDERS = {
            5: 58,
            14: 49,
            38: 20,
            51: 10,
            53: 72,
            64: 83,
            76: 54,
            91: 73,
            97: 61
        };
        this.isPlaying = false;
    }

    storeGameSnapshot() {
        let gameState = { position: this.playerPositions, turn: this.currentPlayerTurn, players: this.numberOfPlayers };
        localStorage.setItem("gameState", JSON.stringify(gameState));
    }

    resetGame() {
        this.playerPositions = { red: 0, green: 0, blue: 0, yellow: 0, computer: 0 };
        localStorage.removeItem("gameState");

        for (const playerName in this.players) {
            let player = this.players[playerName];
            player.setPosition(0);
            player.updatePosition();
        }

        this.currentPlayerTurn = 0;
        this.updateTurn();
        this.showMenu();
    }

    playAudio(src, volume = 1) {
        const audio = new Audio(src);
        audio.volume = volume;
        audio.play();
    }

    updatePlayers() {
        const playersPlayButton = document.getElementsByClassName("play");
        const computerPlayer = this.players.computer;

        Array.from(playersPlayButton).forEach((playerPlayButton, index) => {
            playerPlayButton.style.display = index + 1 <= this.numberOfPlayers ? "block" : "none";
        });

        document.querySelector("#computer").style.display = this.numberOfPlayers === 1 ? "block" : "none";

        for (let playerName in this.players) {
            let player = this.players[playerName];
            player.getPiece().style.display = Object.keys(this.players).indexOf(playerName) + 1 <= this.numberOfPlayers ? "block" : "none";
        }

        computerPlayer.getPiece().style.display = this.numberOfPlayers === 1 ? "block" : "none";
    }

    fetchGameState() {
        let localGameState = localStorage.getItem("gameState");

        if (localGameState) {
            localGameState = JSON.parse(localGameState);
            this.playerPositions = localGameState.position;
            this.currentPlayerTurn = localGameState.turn;
            this.numberOfPlayers = localGameState.players;

            for (let playerName in this.players) {
                let player = this.players[playerName];
                player.setPosition(this.playerPositions[player.getName()]);
                player.updatePosition();
            }

            this.playGround();
        }
    }

    playGround() {
        this.storeGameSnapshot();
        document.querySelector("#menu").style.display = "none";
        document.querySelector("#playground").style.display = "block";
        document.querySelector("#superplay").disabled = false;

        this.updatePlayers();
        this.updateTurn();
    }

    showMenu() {
        document.querySelector("#menu").style.display = "block";
        document.querySelector("#playground").style.display = "none";
        document.querySelector("#superplay").disabled = true;
    }

    async playGame(player) {
        player.getButton().disabled = true;
        document.getElementById("superplay").disabled = true;
        let logPara = document.getElementById("log");
        let isCaptured = false;

        this.playAudio("/audio/roll.mp3");
        let diceRoll = this.rollDice();
        document.getElementById("dice").style.backgroundPositionX = `${this.diceImagePositions[diceRoll - 1]}px`;

        await new Promise(resolve => setTimeout(resolve, 500));
        let finalPosition = this.playerPositions[player.getName()] + diceRoll;

        if (diceRoll === 6) {
            this.playAudio("/audio/bonus.mp3");
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        if (finalPosition <= 100) {
            for (let i = this.playerPositions[player.getName()]; i <= finalPosition; i++) {
                this.playerPositions[player.getName()] = i;
                player.setPosition(this.playerPositions[player.getName()]);
                player.updatePosition();
                this.playAudio("/audio/move.mp3");
                await new Promise(resolve => setTimeout(resolve, 150));
            }
        }

        await new Promise(resolve => setTimeout(resolve, 250));

        if (this.playerPositions[player.getName()] < 100) {
            let initialPos = this.playerPositions[player.getName()];
            if (this.playerPositions[player.getName()] in this.SNAKES_AND_LADDERS) {
                this.playerPositions[player.getName()] = this.SNAKES_AND_LADDERS[this.playerPositions[player.getName()]];
                player.setPosition(this.playerPositions[player.getName()]);
                player.updatePosition();

                if (initialPos > this.playerPositions[player.getName()]) {
                    this.playAudio("/audio/fall.mp3");
                } else {
                    this.playAudio("/audio/rise.mp3");
                }
            }

            let msg = `[${new Date().toLocaleTimeString()}] Player rolled a ${diceRoll}. Current Position: ${this.playerPositions[player.getName()]} <br/>`;
            logPara.innerHTML += msg;
        } else {
            let msg = `[${new Date().toLocaleTimeString()}] Player reached the final square. Game over!`;
            logPara.innerHTML += msg;
            player.setPosition(100);
            player.updatePosition();
            alert(`You won!, ${player.getName()}`);
            this.resetGame();
        }

        for (let playerName in this.playerPositions) {
            if (playerName !== player.getName()) {
                if (this.playerPositions[player.getName()] === this.playerPositions[playerName]) {
                    this.playerPositions[playerName] = 0;
                    isCaptured = true;
                    await new Promise(resolve => setTimeout(resolve, 150));
                    this.players[playerName].setPosition(0);
                    this.players[playerName].updatePosition();
                }
            }
        }

        if (diceRoll !== 6 && !isCaptured) {
            if (this.numberOfPlayers === 1) {
                this.currentPlayerTurn = (this.currentPlayerTurn + 1) % this.numberOfPlayers;
            } else {
                this.currentPlayerTurn = (this.currentPlayerTurn + 1) % this.numberOfPlayers;
            }
        }

        if (this.playerPositions[player.getName()] === 0) {
            player.getPiece().style.bottom = "-70px";
        }

        player.getButton().disabled = false;
        document.getElementById("superplay").disabled = false;

        this.storeGameSnapshot();
        player.setPosition(this.playerPositions[player.getName()]);
        player.updatePosition();
        this.updateTurn();
    }

    playerRoll() {
        if (!this.isPlaying) {
            this.playAudio("/audio/bg.mp3", 0.1);
            this.isPlaying = true;
        }

        switch (this.currentPlayerTurn) {
            case 0:
                this.playGame(this.players.red);
                break;
            case 1:
                if (this.numberOfPlayers !== 1) {
                    this.playGame(this.players.green);
                }
                break;
            case 2:
                this.playGame(this.players.blue);
                break;
            case 3:
                this.playGame(this.players.yellow);
                break;
            case 4:
                if (this.numberOfPlayers === 1) {
                    this.playGame(this.players.computer);
                }
                break;
            default:
                break;
        }
    }

    updateTurn() {
        for (let playerName in this.players) {
            let player = this.players[playerName];
            player.getButton().disabled = true;
            player.getPiece().classList.remove("active");
        }

        const currentPlayer = this.players[Object.keys(this.players)[this.currentPlayerTurn]];
        currentPlayer.getButton().disabled = false;
        currentPlayer.getPiece().classList.add("active");

        if (this.numberOfPlayers === 1 && this.currentPlayerTurn === 4) {
            this.playGame(this.players.computer);
        }
    }

    rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    initializeGame() {
        const gameBoard = document.getElementById("gameBoard");
        const superPlayButton = document.getElementById("superplay");

        let playerNames = ["red", "green", "blue", "yellow", "computer"];

        for (let i = 0; i < playerNames.length; i++) {
            const playerName = playerNames[i];
            const playerPiece = document.getElementById(`${playerName}PlayerPiece`);
            const playerBtn = document.getElementById(playerName);

            const newPlayer = new Player(i, playerName, playerPiece, playerBtn, 0);
            this.players[playerName] = newPlayer;
        }

        gameBoard.style.backgroundImage = "url(/img/bg2.jpg)";

        const playComputerBtn = document.querySelector("#playComputerBtn");
        const playTwoPlayersBtn = document.querySelector("#playTwoPlayersBtn");
        const playThreePlayersBtn = document.querySelector("#playThreePlayersBtn");
        const playFourPlayersBtn = document.querySelector("#playFourPlayersBtn");
        const resetBtn = document.querySelector("#resetBtn");

        resetBtn.addEventListener("click", () => this.resetGame());

        playComputerBtn.addEventListener("click", () => {
            this.numberOfPlayers = 1;
            this.playGround();
        });

        playTwoPlayersBtn.addEventListener("click", () => {
            this.numberOfPlayers = 2;
            this.playGround();
        });

        playThreePlayersBtn.addEventListener("click", () => {
            this.numberOfPlayers = 3;
            this.playGround();
        });

        playFourPlayersBtn.addEventListener("click", () => {
            this.numberOfPlayers = 4;
            this.playGround();
        });

        superPlayButton.addEventListener("click", () => this.playerRoll());

        window.addEventListener("keypress", (e) => {
            if (e.code === "Enter" && superPlayButton.disabled === false) {
                this.playerRoll();
            }
        });

        this.fetchGameState();
        this.updateTurn();
    }
}

// Initialize the game
const game = new GameBoard();
game.initializeGame();
