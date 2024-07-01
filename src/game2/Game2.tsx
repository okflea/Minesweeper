import React, { useState, useEffect } from "react";

const difficultySettings = {
  easy: { rows: 8, cols: 8, bombs: 10 },
  medium: { rows: 16, cols: 16, bombs: 40 },
  hard: { rows: 24, cols: 24, bombs: 99 },
};

type Difficulty = "easy" | "medium" | "hard";

type Square = {
  row: number;
  col: number;
  isRevealed: boolean;
  isBomb: boolean;
  isEmpty: boolean;
  isFlagged: boolean;
  neighborBombs: number;
};

// const numRows = 10;
// const numCols = 10;
// const numBombs = 20;

// const generateSquares = (): Square[][] => {
//   const squares: Square[][] = [];
//   for (let i = 0; i < numRows; i++) {
//     squares[i] = [];
//     for (let j = 0; j < numCols; j++) {
//       squares[i][j] = {
//         row: i,
//         col: j,
//         isRevealed: false,
//         isBomb: false,
//         isEmpty: true,
//         isFlagged: false,
//         neighborBombs: 0,
//       };
//     }
//   }
//   return squares;
// };

// const generateBombs = (squares: Square[][], firstClick: Square) => {
//   let bombsPlaced = 0;
//   while (bombsPlaced < numBombs) {
//     const randRow = Math.floor(Math.random() * numRows);
//     const randCol = Math.floor(Math.random() * numCols);
//     if (
//       !squares[randRow][randCol].isBomb &&
//       (randRow !== firstClick.row || randCol !== firstClick.col)
//     ) {
//       squares[randRow][randCol].isBomb = true;
//       squares[randRow][randCol].isEmpty = false;
//       bombsPlaced++;
//
//       // Update neighboring bomb counts
//       for (let i = -1; i <= 1; i++) {
//         for (let j = -1; j <= 1; j++) {
//           const newRow = randRow + i;
//           const newCol = randCol + j;
//           if (
//             newRow >= 0 &&
//             newRow < numRows &&
//             newCol >= 0 &&
//             newCol < numCols &&
//             !(i === 0 && j === 0)
//           ) {
//             squares[newRow][newCol].neighborBombs++;
//           }
//         }
//       }
//     }
//   }
// };

const Game: React.FC = () => {
  const generateSquares = (rows: number, cols: number): Square[][] => {
    const squares: Square[][] = [];
    for (let i = 0; i < rows; i++) {
      squares[i] = [];
      for (let j = 0; j < cols; j++) {
        squares[i][j] = {
          row: i,
          col: j,
          isRevealed: false,
          isBomb: false,
          isEmpty: true,
          isFlagged: false,
          neighborBombs: 0,
        };
      }
    }
    return squares;
  };

  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const { rows, cols, bombs } = difficultySettings[difficulty];

  // Update these state variables
  const [squares, setSquares] = useState<Square[][]>(
    generateSquares(rows, cols)
  );
  const [flagsRemaining, setFlagsRemaining] = useState<number>(bombs);

  // Add this function to handle difficulty change
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDifficulty = e.target.value as Difficulty;
    setDifficulty(newDifficulty);
    const { rows, cols, bombs } = difficultySettings[newDifficulty];
    setSquares(generateSquares(rows, cols));
    setFlagsRemaining(bombs);
    setGameState("ready");
    setTimer(0);
  };

  // Modify generateSquares and generateBombs functions to use rows, cols, and bombs

  const generateBombs = (
    squares: Square[][],
    firstClick: Square,
    totalBombs: number
  ) => {
    let bombsPlaced = 0;
    while (bombsPlaced < totalBombs) {
      const randRow = Math.floor(Math.random() * rows);
      const randCol = Math.floor(Math.random() * cols);
      if (
        !squares[randRow][randCol].isBomb &&
        (randRow !== firstClick.row || randCol !== firstClick.col)
      ) {
        squares[randRow][randCol].isBomb = true;
        squares[randRow][randCol].isEmpty = false;
        bombsPlaced++;

        // Update neighboring bomb counts
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = randRow + i;
            const newCol = randCol + j;
            if (
              newRow >= 0 &&
              newRow < rows &&
              newCol >= 0 &&
              newCol < cols &&
              !(i === 0 && j === 0)
            ) {
              squares[newRow][newCol].neighborBombs++;
            }
          }
        }
      }
    }
  };

  const [gameState, setGameState] = useState<
    "ready" | "playing" | "won" | "lost"
  >("ready");
  // const [squares, setSquares] = useState<Square[][]>([]);
  const [timer, setTimer] = useState<number>(0);
  // const [flagsRemaining, setFlagsRemaining] = useState<number>(numBombs);

  // useEffect(() => {
  //   setSquares(generateSquares());
  // }, []);

  useEffect(() => {
    if (gameState === "playing") {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const handleSquareClick = (row: number, col: number) => {
    if (gameState === "ready") {
      setGameState("playing");
      const newSquares = generateSquares(rows, cols);
      generateBombs(newSquares, { row, col }, bombs);
      setSquares(newSquares);
      revealSquare(newSquares, row, col);
    } else if (gameState === "playing") {
      revealSquare(squares, row, col);
    }
  };

  const revealSquare = (
    currentSquares: Square[][],
    row: number,
    col: number
  ) => {
    const square = currentSquares[row][col];

    if (square.isFlagged || square.isRevealed) return;

    if (square.isBomb) {
      square.isRevealed = true;
      setGameState("lost");
      console.log("Bomb clicked. Game Over.");
      revealAllBombs(currentSquares);
    } else {
      // Use BFS to reveal empty squares
      const stack: { row: number; col: number }[] = [{ row, col }];

      while (stack.length > 0) {
        const { row, col } = stack.pop()!;
        const currentSquare = currentSquares[row][col];

        if (currentSquare.isRevealed || currentSquare.isFlagged) continue;

        currentSquare.isRevealed = true;

        if (currentSquare.neighborBombs === 0) {
          // Check all neighbors
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;

              if (
                newRow >= 0 &&
                newRow < rows &&
                newCol >= 0 &&
                newCol < cols &&
                !(i === 0 && j === 0)
              ) {
                stack.push({ row: newRow, col: newCol });
              }
            }
          }
        }
      }

      setSquares([...currentSquares]);
      checkGameWon(currentSquares);
    }
  };

  const revealAllBombs = (squares: Square[][]) => {
    squares.forEach((row) => {
      row.forEach((square) => {
        if (square.isBomb) {
          square.isRevealed = true;
        }
      });
    });
    setSquares([...squares]);
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== "playing") return;

    const newSquares = [...squares];
    const square = newSquares[row][col];
    if (square.isRevealed) return;

    if (square.isFlagged) {
      setFlagsRemaining(flagsRemaining + 1);
    } else {
      setFlagsRemaining(flagsRemaining - 1);
    }

    square.isFlagged = !square.isFlagged;
    newSquares[row][col] = square;
    setSquares(newSquares);
    checkGameWon(newSquares);
  };

  const checkGameWon = (currentSquares: Square[][]) => {
    let squaresRevealed = 0;

    currentSquares.forEach((row) => {
      row.forEach((square) => {
        if (square.isRevealed && !square.isBomb) {
          squaresRevealed++;
        }
      });
    });

    const totalNonBombSquares = rows * cols - bombs;

    if (squaresRevealed === totalNonBombSquares) {
      setGameState("won");
      console.log("Game Won!");
    }
  };

  const resetGame = () => {
    setGameState("ready");
    setSquares(generateSquares(rows, cols));
    setTimer(0);
    setFlagsRemaining(bombs);
  };
  const getNumberColor = (number: any) => {
    const colors = [
      "text-blue-500",
      "text-green-500",
      "text-red-500",
      "text-purple-500",
      "text-yellow-500",
      "text-pink-500",
      "text-indigo-500",
      "text-gray-500",
    ];
    return colors[number - 1] || colors[colors.length - 1];
  };
  return (
    <div className="flex flex-col items-center p-4">
      <div className="glass mb-4 flex w-full items-center justify-between rounded-lg border border-slate-300 p-4 dark:border-slate-500">
        <div className="flex items-center space-x-4">
          <div className="timer flex items-center space-x-2 text-2xl font-bold text-gray-700 dark:text-gray-200">
            <span className="text-3xl">⏳</span>
            <span>{timer}</span>
          </div>
          <div className="flags-remaining flex items-center space-x-2 text-2xl font-bold text-gray-700 dark:text-gray-200">
            <span className="text-3xl">🚩</span>
            <span>{flagsRemaining}</span>
          </div>
        </div>
        <div className="game-status text-2xl font-bold text-gray-700 dark:text-gray-200">
          {gameState === "playing"
            ? "🎮 Playing"
            : gameState === "won"
            ? "🎉 You Won!"
            : gameState === "lost"
            ? "💥 You Lost!"
            : "🔍 Ready"}
        </div>
        <button
          className="rounded-lg  p-3 text-2xl text-white transition-transform hover:scale-110  dark:text-gray-200"
          onClick={resetGame}
        >
          🔄
        </button>

        {(gameState === "ready" || gameState === "won") && (
          <div className="mb-4">
            <select
              onChange={handleDifficultyChange}
              value={difficulty}
              className="rounded-lg bg-slate-200 p-2 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
        className="gap-1 rounded-lg bg-slate-300 p-4 shadow-lg dark:bg-slate-700"
      >
        {squares.flat().map((square) => (
          <div
            key={`${square.row}-${square.col}`}
            className={`flex h-10 w-10 items-center justify-center rounded ${
              square.isRevealed
                ? "bg-slate-100 dark:bg-slate-600"
                : "cursor-pointer bg-slate-400 hover:bg-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700"
            } text-slate-800 transition-colors duration-200 dark:text-slate-200`}
            onClick={() => handleSquareClick(square.row, square.col)}
            onContextMenu={(e) => handleRightClick(e, square.row, square.col)}
          >
            {square.isRevealed ? (
              square.isBomb ? (
                "💣"
              ) : square.neighborBombs > 0 ? (
                <span
                  className={`font-bold ${getNumberColor(
                    square.neighborBombs
                  )}`}
                >
                  {square.neighborBombs}
                </span>
              ) : (
                ""
              )
            ) : square.isFlagged ? (
              "🚩"
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
