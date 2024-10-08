import { useState } from "react";

function Square({value, onSquareClick}) {

  return (
    <button className="square" onClick={onSquareClick}>{value}</button>
  );
}

function Board({xIsNext, squares, onPlay, currentMove}) {

  function handleClick(i) {

    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  return (
    <>
    <div className="status">{status}</div>
      {Array(3).fill(null).map((_, row) => (
        <div className="board-row" key={row}>
          {Array(3).fill(null).map((_,col) => {
            const index = row * 3 + col; // Calculate the square index (0 to 8)
            return (
              <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)}/>
            );
          })}
        </div>
      ))}
      
      <div> You are at move #{currentMove}</div>
    </>
  );

}

export default function Game() {

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const [sortType, setSortType] = useState('Asc');

  let sortedHistory = history.slice();

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function sort(){
    if (sortType === 'Asc') {
      setSortType('Desc');
    } else {
      setSortType('Asc');
    }
    sortedHistory = sortedHistory.reverse();
    console.log(sortedHistory);
    console.log(moves);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  let moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  // Sort the moves based on the sortType state
  if (sortType === 'Desc') {
    moves.reverse();  // Reverse the order if 'Desc'
  }

  return (
    <div>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove}/>
        </div>
        <div className="game-info">
          <ol>
            <button onClick={sort}>Sort {sortType}</button>
            {moves}
          </ol>
        </div>
      </div>
    </div>
  )
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}