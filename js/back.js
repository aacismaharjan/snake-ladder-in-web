
function initializeGame() {
    const gameBoard = document.getElementById("gameBoard");

    const redPlayerPiece = document.getElementById("redPlayerPiece"); /* Red Piece */
    const greenPlayerPiece = document.getElementById("greenPlayerPiece"); /* Green Piece */
    const bluePlayerPiece = document.getElementById("bluePlayerPiece"); /* Blue Piece */
    const yellowPlayerPiece = document.getElementById("yellowPlayerPiece"); /* Yellow Piece */
    const computerPlayerPiece = document.getElementById("computerPlayerPiece"); /* Computer Piece */

    const redPlayerBtn = document.getElementById("red"); /* Red Play Button */
    const greenPlayerBtn = document.getElementById("green"); /* Green Play Button */
    const playerBlueBtn = document.getElementById("blue"); /* Blue Play Button */
    const playerYellowBtn = document.getElementById("yellow"); /* Yellow Play Button */
    const computerPlayerBtn = document.getElementById("computer"); /* Computer Play Button */

    const redPlayer = new Player(0, "red", redPlayerPiece, redPlayerBtn, 0);
    const greenPlayer = new Player(1, "green", greenPlayerPiece, greenPlayerBtn, 0);
    const bluePlayer = new Player(2, "blue", bluePlayerPiece, playerBlueBtn, 0);
    const yellowPlayer = new Player(3, "yellow", yellowPlayerPiece, playerYellowBtn, 0);
    const computerPlayer = new Player(4, "computer", computerPlayerPiece, computerPlayerBtn, 0);

    const superPlayButton = document.getElementById("superplay");


    let currentPlayerTurn = 0; /* Red: 0, Green: 1, Blue: 2, Yellow: 3 */
    let numberOfPlayers = 0;  /* No. of players between 1 and 4 */
    let playerNames = ["red", "green", "blue", "yellow", "computer"];

    let players = {
        red: redPlayer,
        green: greenPlayer,
        blue: bluePlayer,
        yellow: yellowPlayer,
        computer: computerPlayer
    }

    /* Current position of player piece in the board, 1-100 */
    let playerPositions = {
        red: 0,
        green: 0,
        blue: 0,
        yellow: 0,
        computer: 0,
    };

    let isPlaying = false;


    const diceImagePositions = [380, 318, 256, 195, 133, 71]; /* For dice number crop */

    /* Logic for snakes or ladders based on player position */
    // gameBoard.style.backgroundImage = "url(/img/bg.jpg)";
    // const SNAKES_AND_LADDERS = {
    //     1: 38,
    //     4: 14,
    //     8: 30,
    //     21: 42,
    //     28: 76,
    //     32: 10,
    //     36: 6,
    //     48: 26,
    //     50: 67,
    //     62: 18,
    //     71: 92,
    //     80: 99,
    //     88: 24,
    //     95: 56,
    //     97: 78
    // };


    gameBoard.style.backgroundImage = "url(/img/bg2.jpg)";
    const SNAKES_AND_LADDERS = {
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


    function storeGameSnapshot(position, turn, players) {
        let gameState = { position, turn, players };
        localStorage.setItem("gameState", JSON.stringify(gameState));
    }

    /* Reset to default state */
    function resetGame() {
        playerPositions = { red: 0, green: 0, blue: 0, yellow: 0, computer: 0 };
        localStorage.removeItem("gameState");

        for (const playerName in players) {
            let player = players[playerName];
            player.setPosition(0);
            player.updatePosition();
        }

        currentPlayerTurn = 0;
        updateTurn();
        showMenu();
    }


    function playAudio(src) {
        var audio = new Audio(src);

        if (src == "/audio/bg.mp3") {
            audio.volume = 0.1;
        } else {
            audio.volume = 1;
        }
        audio.play();
    }



    /* Menu Buttons */
    const playComputerBtn = document.querySelector("#playComputerBtn");
    const playTwoPlayersBtn = document.querySelector("#playTwoPlayersBtn");
    const playThreePlayersBtn = document.querySelector("#playThreePlayersBtn");
    const playFourPlayersBtn = document.querySelector("#playFourPlayersBtn");
    const resetBtn = document.querySelector("#resetBtn");

    function updatePlayers() {
        const playersPlayButton = document.getElementsByClassName("play");

        let i = 0;
        // Display only selected player play button
        Array.from(playersPlayButton).forEach((playerPlayButton, index) => {
            if (index + 1 > numberOfPlayers) {
                playerPlayButton.style.display = "none";
            } else {
                playerPlayButton.style.display = "block";
            }

            if (numberOfPlayers === 1) {
                document.querySelector("#computer").style.display = "block";
            } else {
                document.querySelector("#computer").style.display = "none";
            }
        });

        // Display only selected player piece
        for (let playerName in players) {
            let player = players[playerName];
            if (i + 1 > numberOfPlayers) {
                player.getPiece().style.display = "none";
            } else {
                player.getPiece().style.display = "block";
            }
            if (numberOfPlayers === 1) {
                computerPlayer.getPiece().style.display = "block";
            } else {
                computerPlayer.getPiece().style.display = "none";
            }
            i++;
        }
    }

    function fetchGameState() {
        /* Get current state of game from local storage */
        let localGameState = localStorage.getItem("gameState");

        /* if game is currently saved (localStorage), retrive such game */
        if (localGameState) {
            localGameState = JSON.parse(localGameState);

            playerPositions = localGameState.position;
            currentPlayerTurn = localGameState.turn;
            numberOfPlayers = localGameState.players;


            redPlayer.setPosition(playerPositions["red"]);
            greenPlayer.setPosition(playerPositions["green"]);
            bluePlayer.setPosition(playerPositions["blue"]);
            yellowPlayer.setPosition(playerPositions["yellow"]);
            computerPlayer.setPosition(playerPositions["computer"]);

            redPlayer.updatePosition();
            greenPlayer.updatePosition();
            bluePlayer.updatePosition();
            yellowPlayer.updatePosition();
            computerPlayer.updatePosition();
            playGround();
        }
    }

    function playGround() {
        storeGameSnapshot(playerPositions, currentPlayerTurn, numberOfPlayers);
        document.querySelector("#menu").style.display = "none";
        document.querySelector("#playground").style.display = "block";
        document.querySelector("#superplay").disabled = false;

        updatePlayers();
        updateTurn();
    }


    function showMenu() {
        document.querySelector("#menu").style.display = "block";
        document.querySelector("#playground").style.display = "none";
        document.querySelector("#superplay").disabled = true;
    }

    resetBtn.addEventListener("click", resetGame);

    playComputerBtn.addEventListener("click", (event) => {
        numberOfPlayers = 1;
        playGround();

    });

    playTwoPlayersBtn.addEventListener("click", (event) => {
        numberOfPlayers = 2;
        playGround();
    });

    playThreePlayersBtn.addEventListener("click", (event) => {
        numberOfPlayers = 3;
        playGround();
    });

    playFourPlayersBtn.addEventListener("click", (event) => {
        numberOfPlayers = 4;
        playGround();
    });

    async function playGame(player) {
        console.log(player);
        player.getButton().disabled = true;
        superPlayButton.disabled = true;
        let logPara = document.getElementById("log");
        let isCaptured = false;

        // Roll the dice
        playAudio("/audio/roll.mp3");
        let diceRoll = rollDice();
        document.getElementById("dice").style.backgroundPositionX = `${diceImagePositions[diceRoll - 1]}px`;

        await new Promise(resolve => setTimeout(resolve, 500));
        let finalPosition = playerPositions[player.getName()] + diceRoll;

        if (diceRoll === 6) {
            playAudio("/audio/bonus.mp3");
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        if(finalPosition <= 100) {
            for (let i = playerPositions[player.getName()]; i <= finalPosition; i++) {
                playerPositions[player.getName()] = i;
                player.setPosition(playerPositions[player.getName()]);
                player.updatePosition();
                playAudio("/audio/move.mp3");
                await new Promise(resolve => setTimeout(resolve, 150));
            }
        }
        

        await new Promise(resolve => setTimeout(resolve, 250));

        if (playerPositions[player.getName()] < 100) {
            let initialPos = playerPositions[player.getName()];
            if (playerPositions[player.getName()] in SNAKES_AND_LADDERS) {
                playerPositions[player.getName()] = SNAKES_AND_LADDERS[playerPositions[player.getName()]];
                player.setPosition(playerPositions[player.getName()]);
                player.updatePosition();

                if (initialPos > playerPositions[player.getName()]) {
                    playAudio("/audio/fall.mp3");
                } else {
                    playAudio("/audio/rise.mp3");
                }

            }

            let msg = `[${new Date().toLocaleTimeString()}] Player rolled a ${diceRoll}. Current Position: ${playerPositions[player.getName()]} <br/>`;
            logPara.innerHTML += msg;
        } else {
            let msg = `[${new Date().toLocaleTimeString()}] Player reached the final square. Game over!`;
            logPara.innerHTML += msg;
            player.setPosition(100);
            player.updatePosition();
            alert(`You won!, ${player.getName()}`);
            resetGame();
        }

        // CHECK IF current player has attacked others in same position and make them restart again!
        for (let playerName in playerPositions) {

            if (playerName !== player.getName()) {
                if (playerPositions[player.getName()] === playerPositions[playerName]) {
                    playerPositions[playerName] = 0;
                    isCaptured = true;
                    await new Promise(resolve => setTimeout(resolve, 150));
                    players[playerName].setPosition(0);
                    players[playerName].updatePosition();
                }
            }
        }

        if (diceRoll !== 6 && !isCaptured) {
            if (numberOfPlayers === 1) {
                if (currentPlayerTurn < numberOfPlayers) {
                    currentPlayerTurn++;
                } else {
                    currentPlayerTurn = 0;
                }
            } else {
                if (currentPlayerTurn < (numberOfPlayers - 1)) {
                    currentPlayerTurn++;
                } else {
                    currentPlayerTurn = 0;
                }
            }
        }

        if (playerPositions[player.getName()] == 0) {
            player.getPiece().style.bottom = "-70px";
        }

        player.getButton().disabled = false;
        superPlayButton.disabled = false;

        storeGameSnapshot(playerPositions, currentPlayerTurn, numberOfPlayers);
        player.setPosition(playerPositions[player.getName()]);
        player.updatePosition();
        updateTurn();
    }

    function playerRoll() {
        if (isPlaying === false) {
            playAudio("/audio/bg.mp3");
            isPlaying = true;
        }
        if (currentPlayerTurn === 0) playGame(redPlayer);
        if (numberOfPlayers !== 1 && currentPlayerTurn === 1) playGame(greenPlayer);
        if (currentPlayerTurn === 2) playGame(bluePlayer);
        if (currentPlayerTurn === 3) playGame(yellowPlayer);
        if (numberOfPlayers === 1 && currentPlayerTurn === 1) playGame(computerPlayer);
    }

    superPlayButton.addEventListener("click", playerRoll);

    function updateTurn() {
        for (let playerName in players) {
            let player = players[playerName];
            player.getButton().disabled = true;
        }

        for (let playerName in players) {
            let player = players[playerName];
            player.getPiece().classList.remove("active");
        }

        if (numberOfPlayers === 1 && currentPlayerTurn === 1) {
            computerPlayer.getButton().disabled = false;
            computerPlayer.getPiece().classList.add("active");
            playGame(computerPlayer);
        } else {
            players[playerNames[currentPlayerTurn]].getButton().disabled = false;
            players[playerNames[currentPlayerTurn]].getPiece().classList.add("active");
        }
    }


    function rollDice() {
        let val = Math.floor(Math.random() * 6) + 1;
        return val;
    }

    

    fetchGameState();

    /* Start game on enter key press */
    window.addEventListener("keypress", function PlayOnEnter(e) {
        if (e.code === "Enter" && superPlayButton.disabled === false) {
            playerRoll();
        }
    });


    updateTurn();

}

initializeGame();