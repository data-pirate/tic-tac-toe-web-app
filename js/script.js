const GameBoard = (function () {

    let board = new Array();

    // will make the board
    const makeBoard = function () {
        board[0] = "_";
        for (let i = 1; i < 10; i++) {
            board[i] = ".";
        }
        return board;
    };

    const isNotFull = function () {
        for (let i = 1; i < 10; i++) {
            if (board[i] === ".") {
                return true;
            }
        }
        return false;
    };


    const isSpotAvailable = function (spot) {
        if (board[spot] === ".") {
            return true;
        }
        return false;
    };


    const placeSign = function (sign, spot) {
        if (isSpotAvailable(spot)) {
            board[spot] = sign;
        }
    }

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
    }

    const draw = function () {
        if (!isNotFull() && !checkWinner('x') && !checkWinner('o')) {
            return true;
        }
        return false;
    }


    return { makeBoard, isNotFull, placeSign, checkWinner, draw, board };
})();


const Player = function (sg, status = false) {
    let sign = sg;
    let isActive = status;

    const getSign = function () {
        return sign;
    }

    const getStatus = function () {
        return isActive;
    }
    
    const changeTurn = function () {
        isActive = !isActive;
    }
    
    return { getSign, changeTurn, getStatus };
};


const gameGrid = document.querySelector(".board");

gameGrid.addEventListener("click", (e) => {
    if(e.target.classList.contains('cell')){

        if (b.isNotFull() && !b.checkWinner('x') && !b.checkWinner('o') && !b.draw()) {
            let spot = Number(e.target.id);
            if (player1.getStatus()) {
                b.placeSign(player1.getSign(), spot);
                if(!e.target.classList.contains(player2.getSign())){
                    e.target.classList.add(player1.getSign());
                }
            } else {
                b.placeSign(player2.getSign(), spot);
                if(!e.target.classList.contains(player1.getSign())){
                    e.target.classList.add(player2.getSign());
                }
            }
            
            player1.changeTurn();
            player2.changeTurn();
            
            const status = document.getElementById('sign');
        status.textContent = player1.getStatus() ? player1.getSign().toUpperCase() : player2.getSign().toUpperCase();
    }
    
    if(b.checkWinner('x')){
        const status = document.querySelector('.status');
        status.classList.add('won');
        status.innerHTML = "";
        status.textContent = `X wins`;
    }else if(b.checkWinner('o')){
        const status = document.querySelector('.status');
        status.classList.add('won');
        status.innerHTML = "";
        status.textContent = `O wins`;
    }else if(b.draw()){
        const status = document.querySelector('.status');
        status.classList.add('won');
        status.innerHTML = "";
        status.textContent = `It's a Tie`;
    }
}
});


const restartButton = document.querySelector('.restart');

restartButton.addEventListener('click', startGame);

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
    while(board.firstChild){
        board.removeChild(board.firstChild)
    }

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