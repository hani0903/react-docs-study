import { useState } from 'react';

function Square({ value, onSquareClick, ...props }) {
    return (
        <button onClick={onSquareClick} {...props}>
            {value}
        </button>
    );
}

function Board({ xIsNext, board, onPlay }) {
    const { winner, winCase } = calculateWinner(board);
    const rows = [];
    const BOARD_SIZE = 3;

    for (let i = 0; i < board.length; i += BOARD_SIZE) {
        rows.push(board.slice(i, i + BOARD_SIZE));
    }

    let status;

    if (winner) {
        status = 'Winner: ' + winner;
    } else if (board.every((item) => item !== null)) {
        status = 'draw';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    function handleClick(i) {
        if (board[i] || winner) {
            return;
        }

        const nextBoard = board.slice();

        if (xIsNext) {
            nextBoard[i] = 'X';
        } else {
            nextBoard[i] = 'O';
        }
        onPlay(nextBoard);
    }

    return (
        <>
            <div className="status">{status}</div>
            <div>
                {rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="board-row">
                        {row.map((item, colIdx) => (
                            <Square
                                key={rowIdx * 3 + colIdx}
                                className={`square ${winner && winCase.includes(rowIdx * 3 + colIdx) && 'highlight'}`}
                                value={item}
                                onSquareClick={() => handleClick(rowIdx * 3 + colIdx)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isAscending, setIsAscending] = useState(true);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextBoard) {
        setHistory((currentBoards) => [...currentBoards.slice(0, currentMove + 1), nextBoard]);
        setCurrentMove((prevMove) => prevMove + 1);
    }

    function jumpTo(nextMove) {
        setHistory((prevHistory) => prevHistory.slice(0, nextMove + 1));
        setCurrentMove(nextMove);
    }

    const moves = history.map((board, move) => {
        let description;
        if (move === 0) {
            description = 'Go to game start';
        } else {
            const changeIdx = history[move].findIndex((elem, idx) => elem !== history[move - 1][idx]);
            const row = Math.floor(changeIdx / 3);
            const col = changeIdx % 3;

            if (move === currentMove) {
                return (
                    <li key={move}>
                        당신은 {currentMove}번째 순서({row}, {col})에 있습니다.
                    </li>
                );
            }

            description = `Go to move #${move} (${row}, ${col})`;
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    const sortedMoves = isAscending ? moves : moves.slice().reverse();

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} board={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <button onClick={() => setIsAscending((prevState) => !prevState)}>
                    {isAscending ? '⬇ 내림차순 정렬' : '⬆ 오름차순 정렬'}
                </button>
                <ol reversed={!isAscending}>{sortedMoves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], winCase: lines[i] };
        }
    }
    return { winner: null, winCase: null };
}
