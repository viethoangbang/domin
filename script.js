let boardSize = 10;
let numMines = 20;
let board = [];
let revealedCells = 0;
let timerInterval;
let timeElapsed = 0;

document.getElementById('startGameBtn').addEventListener('click', () => {
    boardSize = parseInt(document.getElementById('size').value);
    numMines = parseInt(document.getElementById('mines').value);
    startGame();
});

function startGame() {
    board = [];
    revealedCells = 0;
    timeElapsed = 0;
    const gameBoard = document.getElementById('game-board');
    const timerDisplay = document.getElementById('timer');
    gameBoard.innerHTML = '';

    // Cập nhật kích thước bảng theo lựa chọn
    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;

    // Tạo bảng 2D
    for (let row = 0; row < boardSize; row++) {
        board[row] = [];
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleRightClick);
            gameBoard.appendChild(cell);
            board[row].push({ mine: false, revealed: false, nearbyMines: 0, flagged: false });
        }
    }

    // Đặt mìn ngẫu nhiên
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            minesPlaced++;
        }
    }

    // Tính số mìn xung quanh mỗi ô
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col].mine) continue;
            let nearbyMines = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                        if (board[newRow][newCol].mine) {
                            nearbyMines++;
                        }
                    }
                }
            }
            board[row][col].nearbyMines = nearbyMines;
        }
    }

    // Bắt đầu bộ đếm thời gian
    startTimer(timerDisplay);
}

// Xử lý khi người chơi nhấp chuột trái vào ô
function handleCellClick(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    const cell = board[row][col];
    const cellElement = event.target;

    if (cell.revealed || cell.flagged) return; // Nếu ô đã mở hoặc đã được đánh dấu

    cell.revealed = true;
    cellElement.classList.add('revealed');
    cellElement.classList.remove('cell');

    if (cell.mine) {
        cellElement.classList.add('mine');
        cellElement.innerText = '💣'; // Hiển thị biểu tượng bom
        alert('Game Over!');
        revealAllCells();
        stopTimer();
        return;
    }

    if (cell.nearbyMines > 0) {
        cellElement.innerText = cell.nearbyMines;
        cellElement.style.fontSize = '16px';  // Căn giữa số
    } else {
        cellElement.classList.add('safe');
    }

    revealedCells++;
    if (revealedCells === (boardSize * boardSize - numMines)) {
        alert('You Win!');
        stopTimer();
    }
}

// Xử lý chuột phải để đánh dấu mìn
function handleRightClick(event) {
    event.preventDefault();
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    const cell = board[row][col];
    const cellElement = event.target;

    if (cell.revealed) return;  // Không cho đánh dấu mìn trên ô đã mở

    cell.flagged = !cell.flagged;
    if (cell.flagged) {
        cellElement.classList.add('flagged');
    } else {
        cellElement.classList.remove('flagged');
    }
}

// Mở tất cả các ô xung quanh khi một ô không có mìn
function revealAdjacentCells(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                const cell = board[newRow][newCol];
                const cellElement = document.querySelector(`[data-row='${newRow}'][data-col='${newCol}']`);
                if (!cell.revealed && !cell.mine) {
                    handleCellClick({ target: cellElement });
                }
            }
        }
    }
}

// Hiển thị tất cả các ô khi kết thúc trò chơi
function revealAllCells() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = board[row][col];
            const cellElement = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
            if (cell.mine) {
                cellElement.classList.add('mine');
                cellElement.innerText = '💣'; // Hiển thị biểu tượng bom
            } else {
                cellElement.classList.add('safe');
                if (cell.nearbyMines > 0) {
                    cellElement.innerText = cell.nearbyMines;
                }
            }
            cell.revealed = true;
        }
    }
}

// Bắt đầu bộ đếm thời gian
function startTimer(timerDisplay) {
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerDisplay.innerText = `Thời gian: ${timeElapsed}s`;
    }, 1000);
}

// Dừng bộ đếm thời gian
function stopTimer() {
    clearInterval(timerInterval);
}
