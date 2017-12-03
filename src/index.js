import React from 'react';
import ReactDOM from 'react-dom';
import { Transition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import './index.css';

function Square({value, onClick}) {
  return (
    <span className="square" onClick={onClick}>
      {value}
    </span>
  );
}

function Board({squares, onClick, animation}) {
  const renderSquare = i => (
    <Square
      value={squares[i]}
      onClick={() => onClick(i)}
    />
  );

  const renderRow = i => (
    <div className="board-row">
      {renderSquare(i * 3 + 0)}
      {renderSquare(i * 3 + 1)}
      {renderSquare(i * 3 + 2)}
    </div>
  );

  const className = classNames({
    'board-grid': true,
    [`board-grid-${animation}`]: animation
  });

  return (
    <div className={className}>
      {renderRow(0)}
      {renderRow(1)}
      {renderRow(2)}
    </div>
  );
}

function HistoryItem({index, diff, status, onClick}) {
  const moveNumber = !index ?  'game start' : `move #${index}`;
  const description = `Go to ${moveNumber}`;

  const className = classNames({
    'history-entry': true,
    'history-entry-current': diff === 0,
    'history-entry-next': diff > 0,
    [`history-entry-${status}`]: true
  });

  return (
    <button className={className} onClick={onClick}>
      {description}
    </button>
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
      historyIndex: 0,
      animation: false,
      handleAnimationEnd: null
    };
  }

  get currentState() {
    return this.state.history[this.state.historyIndex];
  }

  pushState(newState) {
    const history = this.state.history.slice(0, this.state.historyIndex + 1);
    history.push(newState);
    this.setState({
      ...this.state,
      history,
      historyIndex: this.state.historyIndex + 1,
    });
  }

  jumpToState(index) {
    const animation =
      index < this.state.historyIndex ?
        'jump-backward' :
      index === this.state.historyIndex ?
        'jump-invalid' :
        'jump-forward';
    this.setStateAfterAnimation(animation, {
        historyIndex: index
    });
  }

  setStateAfterAnimation(animation, newState) {
    if (this.state.animation) {
      this.setState({
        ...this.state,
        ...newState
      });
      return;
    }

    this.setState({
      ...this.state,
      animation,
      handleAnimationEnd: () => {
        this.setState({
          ...this.state,
          ...newState,
          animation: null,
          handleAnimationEnd: null
        });
      }
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
      this.setStateAfterAnimation('click-invalid', {});
      return;
    }

    const squares = this.currentState.squares.slice();
    squares[i] = this.nextPlayer;
    this.pushState({
      squares
    });
  }

  handleAnimationEnd() {
    if (this.state.handleAnimationEnd) {
      this.state.handleAnimationEnd();
    }
  }

  render() {
    return (
      <div className="game" onAnimationEnd={() => this.handleAnimationEnd()}>
        <div className="game-main">
          {this.renderStatus()}
          <Board
            squares={this.currentState.squares}
            onClick={i => this.handleClick(i)}
            animation={this.state.animation}
          />
        </div>
        {this.renderHistory()}
      </div>
    );
  }

  renderStatus() {
    const winner = this.calculateWinner();
    const status =
      winner ?
        `${winner} is the winner!` :
      this.state.historyIndex === 9 ?
        "It's a tie." :
        `${this.nextPlayer} is next...`;

    return (
      <div className="status">{status}</div>
    );
  }

  renderHistory() {
    const createHistoryItem = (i, status) => (
      <HistoryItem
        index={i}
        diff={i - this.state.historyIndex}
        status={status}
        onClick={() => this.jumpToState(i)}
      />
    );

    const historyItems = this.state.history.map((_state, i) => (
      <Transition key={i} timeout={{enter: 0, exit: 400}}>
        {status => createHistoryItem(i, status)}
      </Transition>
    ));

    return (
      <TransitionGroup className="history">
        {historyItems}
      </TransitionGroup>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.querySelector('.root')
);
