import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
  const renderSquare = i => (
    <Square
      value={props.squares[i]}
      onClick={() => props.onClick(i)}
    />
  );

  const renderRow = i => (
    <div className="board-row">
      {renderSquare(i * 3 + 0)}
      {renderSquare(i * 3 + 1)}
      {renderSquare(i * 3 + 2)}
    </div>
  );

  return (
    <div>
      {renderRow(0)}
      {renderRow(1)}
      {renderRow(2)}
    </div>
  );
}

class Game extends React.Component {
  constructor() {
    super()
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true
    };
  }

  get nextPlayer() {
    return this.state.xIsNext ? 'X' : 'O';
  }

  calculateWinner() {
    const createLine = (from, by) =>
      [0, 1, 2].map(i => from + i * by);

    const winningLines = [
      createLine(0, 1),
      createLine(0, 3),
      createLine(0, 4),
      createLine(1, 3),
      createLine(2, 2),
      createLine(2, 3),
      createLine(3, 1),
      createLine(6, 1),
    ];

    const getSquares = line =>
      line.map(i => this.state.squares[i]).join('');

    const isWinner = squares =>
      squares === 'XXX' || squares === 'OOO';

    return (winningLines.map(getSquares).find(isWinner) || '')[0];
  }

  handleClick(i) {
    if (this.calculateWinner() || this.state.squares[i]) {
      return;
    }

    const squares = this.state.squares.slice();
    squares[i] = this.nextPlayer;
    this.setState({
      squares,
      xIsNext: !this.state.xIsNext
    });
  }

  render() {
    const winner = this.calculateWinner();
    const status = winner ?
      `Winner: ${winner}` :
      `Next player: ${this.nextPlayer}`;

    return (
      <div className="game">
        <div className="game-board">
          <div className="status">{status}</div>
          <Board
            squares={this.state.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
