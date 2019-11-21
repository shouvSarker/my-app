import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


type OldProps = {
	readonly value: string;
	// eslint-disable-next-line functional/no-mixed-type, functional/no-return-void
	readonly onClick: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Square(props: OldProps): JSX.Element {
	return (
		<button
			className="square"
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}

type BoardProps = {
	readonly squares: readonly string[];
	// eslint-disable-next-line functional/no-mixed-type, functional/no-return-void
	readonly onClick: (i: number) => void;

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Board(props: BoardProps): JSX.Element {
	const renderSquare = (i: number): JSX.Element => {
		return (
			<Square
				value={props.squares[i]}
				//eslint-disable-next-line functional/functional-parameters
				onClick={() => props.onClick(i)}
			/>
		);
	}

	//render() {

		return (
			<div>
				<div className="board-row">
					{renderSquare(0)}
					{renderSquare(1)}
					{renderSquare(2)}
				</div>
				<div className="board-row">
					{renderSquare(3)}
					{renderSquare(4)}
					{renderSquare(5)}
				</div>
				<div className="board-row">
					{renderSquare(6)}
					{renderSquare(7)}
					{renderSquare(8)}
				</div>
			</div>
		);
	//}
}


type GameProps = {
	//history: object[],
	readonly squares: readonly string[];
};

type CurState = {
	//squares: string[]
	//[key: string]: string[];
};

type Ihistory = {
	readonly squares: readonly string[];
}

type CurVars = {
	readonly stepNumber: number;
	readonly xIsNext: boolean;
	readonly history: readonly Ihistory[];
	//squares: string[]
};

class Game extends React.Component<CurState, CurVars, GameProps> {

	constructor(props: GameProps) {
		super(props);

		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],

			stepNumber: 0,
			xIsNext: true
		};
	}

	handleClick(i: number) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares: readonly string[] = current.squares.slice();
		const squares_front: readonly string[] = squares.slice(0, i);
		const squares_end: readonly string[] = squares.slice(i+1);

		if (calculateWinner(squares) || squares[i]) {
			return;
		}

		const new_squares: readonly string[] = [...squares_front, ...[this.state.xIsNext ? "X" : "O"], ...squares_end];
		
		this.setState({
			history: history.concat([{
				squares: new_squares
			}]),

			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}

	jumpTo(step: number) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((_: Ihistory, move: number) => {
			const desc = move ?
				'Go to move #' + move :
				'Go to game start';
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status: string;
		if (winner) {
			status = "Winner: " + winner;
		} else {
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={i => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}

}

// ========================================

// eslint-disable-next-line functional/no-expression-statement
ReactDOM.render(
	<Game />,
	document.getElementById('root')
);


function calculateWinner(squares: readonly string[]): string | null {
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

	/*
	function compare(line: number[]){
		const [a, b, c] = line;
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}

	lines.filter(compare);

	return null;
	*/
	
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
	
}
