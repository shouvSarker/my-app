// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import { number } from 'prop-types';


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
	] as const;

	const firstMatch = lines.find( ([a, b, c])=> {
		return squares[a] && squares[a] === squares[b] && squares[a] === squares[c];
	});

	return firstMatch? squares[firstMatch[0]] : null
	
	/*
	function compare(line: number[]){
		const [a, b, c] = line;
		
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}

	lines.filter(compare);

	return null;
	
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
	*/
	
}

/*
type GameProps = {
	//history: object[],
	readonly squares: readonly string[];
};

type CurState = {
	readonly squares: readonly string[];
	//[key: string]: string[];
	readonly stepNumber: number;
	readonly xIsNext: boolean;
	readonly history: readonly Ihistory[];
};
*/

type Ihistory = {
	readonly squares: readonly string[];
}

/*
type CurVars = {
	readonly stepNumber: number;
	readonly xIsNext: boolean;
	readonly history: readonly Ihistory[];
	//squares: string[]
};
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars, functional/functional-parameters
function Game(): JSX.Element {

	/*
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
	*/

	const [history, setHistory] = useState<readonly Ihistory[]>([{
		// eslint-disable-next-line functional/immutable-data
		squares: Array(9).fill(null)
	}]);
	const [stepNumber, setStepNumber] = useState(0);
	const [xIsNext, setXIsNext] = useState(true);

	// eslint-disable-next-line functional/no-return-void
	const handleClick = (i: number): void => {
		const historyHandle = history.slice(0, stepNumber + 1);
		const current = historyHandle[historyHandle.length - 1];
		const squares: readonly string[] = current.squares.slice();
		const squaresFront: readonly string[] = squares.slice(0, i);
		const squaresEnd: readonly string[] = squares.slice(i+1);

		// eslint-disable-next-line functional/no-conditional-statement
		if (calculateWinner(squares) || squares[i]) {
			return;
		}

		const newSquares: readonly string[] = [...squaresFront, ...[xIsNext ? "X" : "O"], ...squaresEnd];
		
		// eslint-disable-next-line functional/no-expression-statement
		setHistory(historyHandle.concat([{
			squares: newSquares
		}]));

		// eslint-disable-next-line functional/no-expression-statement
		setStepNumber(historyHandle.length);
		// eslint-disable-next-line functional/no-expression-statement
		setXIsNext(!xIsNext);

	}

	// eslint-disable-next-line functional/no-return-void
	const jumpTo = (step: number): void => {
		// eslint-disable-next-line functional/no-expression-statement
		setStepNumber(step);
		// eslint-disable-next-line functional/no-expression-statement
		setXIsNext(step%2 === 0);
	}

	//render() {
		//const history = this.state.history;
		const current = history[stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((_: Ihistory, move: number) => {
			const desc = move ?
				'Go to move #' + move :
				'Go to game start';
			return (
				<li key={move}>
					
					<button 
						onClick={
							// eslint-disable-next-line functional/functional-parameters
							() => jumpTo(move)
						}>{
							desc
						}
					</button>
				</li>
			);
		});

		const status: string = winner ? "Winner: " + winner : "Next player: " + (xIsNext ? "X" : "O");

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={i => handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	//}

}

// ========================================

// eslint-disable-next-line functional/no-expression-statement
ReactDOM.render(
	<Game />,
	document.getElementById('root')
);