const board = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.querySelector('.restart');
const toggleThemeBtn = document.querySelector('.toggle-theme');
let isDarkMode = false;
let currentPlayer = 'X';
let boardState = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');

        if (boardState[index] === '' && isGameActive) {
            boardState[index] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add('clicked');
            checkWinner();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    });
});

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        isGameActive = false;
        alert(`Player ${currentPlayer} wins!`);
    } else if (!boardState.includes('')) {
        isGameActive = false;
        alert("It's a draw!");
    }
}

// Handle restart button
restartBtn.addEventListener('click', () => {
    boardState = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('clicked');
    });
});

// Handle light/dark mode toggle
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// Set Default Theme based on System Preferences
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = 'Switch to Light Mode';
  } else {
    document.body.classList.add('light-mode');
    themeToggle.textContent = 'Switch to Dark Mode';
  }