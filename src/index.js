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
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      historyIndex: 0
    };
  }

  get currentState() {
    return this.state.history[this.state.historyIndex];
  }

  pushState(newState) {
    const history = this.state.history.slice(0, this.state.historyIndex + 1);
    history.push(newState);
    this.setState({
      history,
      historyIndex: this.state.historyIndex + 1
    });
  }

  jumpToState(index) {
    const history = this.state.history;
    this.setState({
      history,
      historyIndex: index
    });
  }

  get nextPlayer() {
    return (this.state.historyIndex % 2) === 0 ? 'X' : 'O';
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
      line.map(i => this.currentState.squares[i]).join('');

    const isWinner = squares =>
      squares === 'XXX' || squares === 'OOO';

    return (winningLines.map(getSquares).find(isWinner) || '')[0];
  }

  handleClick(i) {
    if (this.calculateWinner() || this.currentState.squares[i]) {
      return;
    }

    const squares = this.currentState.squares.slice();
    squares[i] = this.nextPlayer;
    this.pushState({
      squares
    });
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          {this.renderStatus()}
          <Board
            squares={this.currentState.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          {this.renderHistory()}
        </div>
      </div>
    );
  }

  renderStatus() {
    const winner = this.calculateWinner();
    const status = winner ?
      `Winner: ${winner}` :
      `Next player: ${this.nextPlayer}`;

    return (
      <div className="status">{status}</div>
    );
  }

  renderHistory() {
    const moves = this.state.history.map((_state, i) => {
      const description = i ?
        `Go to move #${i}` :
        'Go to game start';
      return (
        <li key={i}>
          <button onClick={() => this.jumpToState(i)}>
            {description}
          </button>
        </li>
      );
    });
    return (
      <ol>{moves}</ol>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
