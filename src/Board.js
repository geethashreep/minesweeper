import { useState, useEffect } from 'react';
import './design.css';

const Board = ({ size, mines }) => {
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {

  const initBoard = () => {
    let newBoard = Array(size)
      .fill(null)
      .map(() =>
        Array(size).fill(null).map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighbourMines: 0,
        }))
      );

    let mineCount = 0;
    while (mineCount < mines) {
      let row = Math.floor(Math.random() * size);
      let col = Math.floor(Math.random() * size);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        mineCount++;
      }
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!newBoard[r][c].isMine) {
          newBoard[r][c].neighbourMines = countNeighbourMines(newBoard, r, c);
        }
      }
    }

    setBoard(newBoard);
  };
  initBoard();
  }, [size, mines]);
  const countNeighbourMines = (board, row, col) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1], 
      [0, -1], [0, 1], 
      [1, -1], [1, 0], [1, 1]
    ];

    let count = 0;
    for (let [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && board[newRow][newCol].isMine) {
        count++;
      }
    }
    return count;
  };

  const revealAllMines = (newBoard) => {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (newBoard[r][c].isMine) {
          newBoard[r][c].isRevealed = true;
        }
      }
    }
    setBoard(newBoard);
  };

  const revealCell = (row, col) => {
    if (board[row][col].isFlagged || board[row][col].isRevealed) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    if (newBoard[row][col].isMine) {
      newBoard[row][col].isRevealed = true;
      setBoard(newBoard);
      revealAllMines(newBoard);
      setTimeout(() => {
        setGameOver(true);
      }, 500);
    } else {
      newBoard[row][col].isRevealed = true;
      if (newBoard[row][col].neighbourMines === 0) {
        revealCellsDFS(row, col, newBoard);
      }
      setBoard(newBoard);
    }

    const nonMines = size * size - mines;
    const revealedCellsCount = newBoard.flat().filter(cell => cell.isRevealed).length;
    if (nonMines === revealedCellsCount) {
      alert("Cleared!");
    }
  };

  const revealCellsDFS = (row, col, newBoard) => {
    if (
      row < 0 || row >= size ||
      col < 0 || col >= size ||
      newBoard[row][col].isRevealed ||
      newBoard[row][col].isFlagged
    ) return;

    newBoard[row][col].isRevealed = true;

    if (newBoard[row][col].neighbourMines === 0) {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1], 
        [0, -1], [0, 1], 
        [1, -1], [1, 0], [1, 1]
      ];
      for (let [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        revealCellsDFS(newRow, newCol, newBoard);
      }
    }
  };

  const flagCell = (row, col) => {
    if (board[row][col].isRevealed) return;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
  };

  return (
    <div>
  {gameOver ? (
    <h2 class="go">Game Over! Refresh to try again.</h2>
  ) : (
    <div className="board">
      {board.map((row, rIdx) => (
        <div key={rIdx} className="board-row">
          {row.map((cell, cIdx) => (
            <div
              key={cIdx}
              className={`cell ${cell.isRevealed ? 'revealed' : ''} ${cell.isFlagged ? 'flagged' : ''} ${cell.isRevealed && !cell.isMine && cell.neighbourMines > 0 ? `value-${cell.neighbourMines}` : ''}`}
              onClick={() => revealCell(rIdx, cIdx)}
              onContextMenu={(e) => {
                e.preventDefault();
                flagCell(rIdx, cIdx);
              }}
            >
              {cell.isRevealed
                ? cell.isMine
                  ? '💣'
                  : cell.neighbourMines > 0
                  ? <span>{cell.neighbourMines}</span>
                  : '0'
                : cell.isFlagged
                ? '🚩'
                : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default Board;
