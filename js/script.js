/**
 * Author: damanpreet singh
 * Dated: Oct 9, 2021
 * 
 */


/**
 * Object `GameBoard`
 * makes the functionalities of the board
 * check for wins and draw
 * chcecks if the space is availble
 */
const GameBoard = (function () {

    // make a new array to store the player signs
    let board = new Array();

    // will fill the board
    // `.` means the space is empty
    const makeBoard = function () {
        board[0] = "_";
        for (let i = 1; i < 10; i++) {
            board[i] = ".";
        }
        return board;
    };

    // checks if the there is any space in the board;
    const isNotFull = function () {
        for (let i = 1; i < 10; i++) {
            if (board[i] === ".") {
                return true;
            }
        }
        return false;
    };

    // checks if the current spot is available
    const isSpotAvailable = function (spot) {
        if (board[spot] === ".") {
            return true;
        }
        return false;
    };

    // places the sign in the array
    const placeSign = function (sign, spot) {
        if (isSpotAvailable(spot)) {
            board[spot] = sign;
        }
    };

    // check if anyone has won or not
    // checks the rows, cols and the diagonals
    const checkWinner = function (sign) {
        if ((board[1] === sign && board[2] === sign && board[3] === sign) ||
            (board[4] === sign && board[5] === sign && board[6] === sign) ||
            (board[7] === sign && board[8] === sign && board[9] === sign) ||
            (board[1] === sign && board[4] === sign && board[7] === sign) ||
            (board[2] === sign && board[5] === sign && board[8] === sign) ||
            (board[3] === sign && board[6] === sign && board[9] === sign) ||
            (board[1] === sign && board[5] === sign && board[9] === sign) ||
            (board[3] === sign && board[5] === sign && board[7] === sign)) {
            return true;
        }
        return false;
    };

    // give emptySpaces
    const emptySpaces = function(){
        let arr = new Array();
        for(let i = 1; i < 10; i++){
            if(board[i] === "."){
                arr.push(i);
            }
        }

        return arr;
    };

    // if board is full and nobody has won
    const draw = function () {
        if (!isNotFull() && !checkWinner('x') && !checkWinner('o')) {
            return true;
        }
        return false;
    };


    // returns the public methods
    return { makeBoard, isNotFull, placeSign, checkWinner, draw, emptySpaces, isSpotAvailable};
})();

/**
 * `Player` object
 * @param {char} sg 
 * @param {boolean} status 
 * creates sign and turn status
 */
const Player = function (sg, status = false) {
    let sign = sg;
    let isActive = status;

    // returns the sign of the player
    const getSign = function () {
        return sign;
    }

    // returns if it is the players turn or not
    const getStatus = function () {
        return isActive;
    }
    
    // toggles the turn
    const changeTurn = function () {
        isActive = !isActive;
    }
    
    return { getSign, changeTurn, getStatus };
};


// for computer to play
const ai = (function(){

    let arr;

    // get all the possible moves available at the given time
    const getEmptySpaces = function(){
        arr = b.emptySpaces();
    };

    // Choose a spot to Place the sign
    const makeMove = function(){
        getEmptySpaces();
        let sign = player2.getSign();
        let spot = arr[Math.floor(Math.random() * arr.length)];
        b.placeSign(sign, spot);
        const target = document.getElementById(`${spot}`);
        if(target){
            if(!target.classList.contains(player1.getSign())){
                target.classList.add(sign);
            }
        }

        // toggle each other's turn
        changeStatus();
    }

    return {makeMove};
})();


// grab the board
const gameGrid = document.querySelector(".board");

// to listen to user click events
gameGrid.addEventListener("click", (e) => {
    
    // check if the target on which the event is fired is a cell or not
    if(e.target.classList.contains('cell')){
        // grab the target id
        let spot = Number(e.target.id);

        /**
         * things to check:
         * 1. is the board full
         * 2. have anyone won (x or o)
         * 3. is it a draw
         * 4. is the spot available
         */
        if (b.isNotFull() && !b.checkWinner('x') && !b.checkWinner('o') && !b.draw() && b.isSpotAvailable(spot)) {
            if (player1.getStatus()) {
                let sign = player1.getSign();
                b.placeSign(sign, spot);
                
                if(!e.target.classList.contains(player2.getSign())){
                    e.target.classList.add(sign);
                }
            }
            
            
            // change their active status;
            changeStatus();

        }
        
        // game is not over yet
        let notOver = true;
        if(b.checkWinner('x')){
            gameOver('X wins');
            notOver = false;
        }else if(b.checkWinner('o')){
            gameOver('O wins');
            notOver = false;
        }else if(b.draw()){
            gameOver(`It's a Tie`);
            notOver = false;
        }

        // computer only makes a move when its his turn and game is not over
        if(player2.getStatus() && notOver){
            // added a timeout to add a little delay in Ai's move :)
            setTimeout(ai.makeMove , 500);
        }
    }
});


function changeStatus(){
    player1.changeTurn();
    player2.changeTurn();

    const status = document.getElementById('sign');
    if(status){
        status.textContent = player1.getStatus() ? player1.getSign().toUpperCase() : player2.getSign().toUpperCase();
    }
}

function gameOver(str){
    const status = document.querySelector('.status');
    status.classList.add('won');
    status.innerHTML = "";
    status.textContent = str;
}


const restartButton = document.querySelector('.restart');

restartButton.addEventListener('click', startGame);

// restrats the game from the start
// clears all the existing cells
function startGame(){
    b = Object.create(GameBoard);
    b.makeBoard();

    player1 = Player('x', true);
    player2 = Player('o');
    const status = document.querySelector('.status');
    if(status.classList.contains('won')){
        status.classList.remove('won');
        status.innerHTML = `<span id="sign">X</span>'s turn`;
    }

    makeCells(gameGrid);

}

function makeCells(board){
    // remove all the existing cells
    while(board.firstChild){
        board.removeChild(board.firstChild)
    }

    // insert new ones
    const div = document.createElement('div');
    div.setAttribute('class', 'cell');
    for(let i = 1; i < 10; i++){
        div.setAttribute('id', i);
        board.appendChild(div.cloneNode(true));
    }
}

let b;
let player1;
let player2;

makeCells(gameGrid);
startGame();