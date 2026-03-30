import { useState } from 'react'
import Board from "./board/Board.jsx";

import blackPawn from "./assets/blackPawn.png";
import blackPawnClicked from "./assets/blackPawnClicked.png";
import blackBishop from "./assets/blackBishop.png";
import blackBishopClicked from "./assets/blackBishopClicked.png";
import blackKnight from "./assets/blackKnight.png";
import blackKnightClicked from "./assets/blackKnightClicked.png";
import blackRook from "./assets/blackRook.png";
import blackRookClicked from "./assets/blackRookClicked.png";
import blackQueen from "./assets/blackQueen.png";
import blackQueenClicked from "./assets/blackQueenClicked.png";
import blackKing from "./assets/blackKing.png";
import blackKingClicked from "./assets/blackKingClicked.png";

import whitePawn from "./assets/whitePawn.png";
import whitePawnClicked from "./assets/whitePawnClicked.png";
import whiteBishop from "./assets/whiteBishop.png";
import whiteBishopClicked from "./assets/whiteBishopClicked.png";
import whiteKnight from "./assets/whiteKnight.png";
import whiteKnightClicked from "./assets/whiteKnightClicked.png";
import whiteRook from "./assets/whiteRook.png";
import whiteRookClicked from "./assets/whiteRookClicked.png";
import whiteQueen from "./assets/whiteQueen.png";
import whiteQueenClicked from "./assets/whiteQueenClicked.png";
import whiteKing from "./assets/whiteKing.png";
import whiteKingClicked from "./assets/whiteKingClicked.png";

import greenDot from "./assets/greenDot.png";

const generateBoardSlots = () => {
	const column = ["A", "B", "C", "D", "E", "F", "G", "H"];
	const row = [8, 7, 6, 5, 4, 3, 2, 1];

	const slots = row.flatMap((r) =>
		column.map((c) => ({
			slot: `${c}${r}`,
			piece: null,
			clickable: false
		}))
	);
	return {column, row, slots};
}

function generatePieces(column, row){
	const officials = [
		{image: blackQueen, imageClicked: blackQueenClicked, name: "blackQueen", type: "Queen", slot: `${column[3]}${row[0]}`, team: 2, clicked: false},
		{image: blackKing, imageClicked: blackKingClicked,name: "blackKing", type: "King", slot: `${column[4]}${row[0]}`, team: 2, clicked: false, moved: false},
		{image: blackBishop, imageClicked: blackBishopClicked, name: "blackBishop1", type: "Bishop", slot: `${column[2]}${row[0]}`, team: 2, clicked: false},
		{image: blackBishop, imageClicked: blackBishopClicked, name: "blackBishop2", type: "Bishop", slot: `${column[5]}${row[0]}`, team: 2, clicked: false},
		{image: blackKnight, imageClicked: blackKnightClicked, name: "blackKnight1", type: "Knight", slot: `${column[1]}${row[0]}`, team: 2, clicked: false},
		{image: blackKnight, imageClicked: blackKnightClicked, name: "blackKnight2", type: "Knight", slot: `${column[6]}${row[0]}`, team: 2, clicked: false},
		{image: blackRook, imageClicked: blackRookClicked, name: "blackRook1", type: "Rook", slot: `${column[0]}${row[0]}`, team: 2, clicked: false, moved: false},
		{image: blackRook, imageClicked: blackRookClicked, name: "blackRook2", type: "Rook", slot: `${column[7]}${row[0]}`, team: 2, clicked: false, moved: false},
		{image: whiteQueen, imageClicked: whiteQueenClicked, name: "whiteQueen", type: "Queen", slot: `${column[3]}${row[7]}`, team: 1, clicked: false},
		{image: whiteKing, imageClicked: whiteKingClicked, name: "whiteKing", type: "King", slot: `${column[4]}${row[7]}`, team: 1, clicked: false, moved: false},
		{image: whiteBishop, imageClicked: whiteBishopClicked, name: "whiteBishop1", type: "Bishop", slot: `${column[2]}${row[7]}`, team: 1, clicked: false},
		{image: whiteBishop, imageClicked: whiteBishopClicked, name: "whiteBishop2", type: "Bishop", slot: `${column[5]}${row[7]}`, team: 1, clicked: false},
		{image: whiteKnight, imageClicked: whiteKnightClicked, name: "whiteKnight1", type: "Knight", slot: `${column[1]}${row[7]}`, team: 1, clicked: false},
		{image: whiteKnight, imageClicked: whiteKnightClicked, name: "whiteKnight2", type: "Knight", slot: `${column[6]}${row[7]}`, team: 1, clicked: false},
		{image: whiteRook, imageClicked: whiteRookClicked, name: "whiteRook1", type: "Rook", slot: `${column[0]}${row[7]}`, team: 1, clicked: false, moved: false},
		{image: whiteRook, imageClicked: whiteRookClicked, name: "whiteRook2", type: "Rook", slot: `${column[7]}${row[7]}`, team: 1, clicked: false, moved: false}
	];

	const pawns = [];

	for(let i = 0; i < column.length; i++){
		pawns.push({
			image: blackPawn,
			imageClicked: blackPawnClicked,
			name: `blackPawn${i}`,
			type: "blackPawn",
			slot: `${column[i]}${row[1]}`,
			team: 2, clicked: false
		}, {
			image: whitePawn,
			imageClicked: whitePawnClicked,
			name: `whitePawn${i}`,
			type: "whitePawn",
			slot: `${column[i]}${row[6]}`,
			team: 1,
			clicked: false
		})
	}
	return [...officials, ...pawns];
}

//=====PAWN MOVES=====
function whitePawnMoves(colIndex, rowIndex, currentPiece, pieces, column, row){
	const moves = [];

	const detectEnemy = [
		{c: colIndex - 1, r: rowIndex - 1},
		{c: colIndex + 1, r: rowIndex - 1}
	]

	detectEnemy.forEach(({c, r}) => {
		if(c < 0 || c > 7 || r < 0 || r > 7) return;

		const detectingSlot = column[c] + row[r];
		const pieceDetected = pieces.find(p => p.slot === detectingSlot);

		if(pieceDetected && pieceDetected.team !== currentPiece.team){
			moves.push({c, r});
		}
	})

	const oneStep = {
		c: colIndex, r: rowIndex - 1
	}

	const oneStepSlot = column[oneStep.c] + row[oneStep.r];
	const oneStepBlock = pieces.find(p => p.slot === oneStepSlot);

	if(!oneStepBlock){
		moves.push(oneStep);

		if(rowIndex === 6){
			const twoStep = {
				c: colIndex, r: rowIndex - 2 
			};

			const twoStepSlot = column[twoStep.c] + row[twoStep.r];
			const twoStepBlock = pieces.find(p => p.slot === twoStepSlot);

			if(!twoStepBlock) moves.push(twoStep);
		}
	}
	return moves;
}


function blackPawnMoves(colIndex, rowIndex, currentPiece, pieces, column, row){
	const moves = [];

	const detectEnemy = [
		{c: colIndex - 1, r: rowIndex + 1},
		{c: colIndex + 1, r: rowIndex + 1}
	]

	detectEnemy.forEach(({c, r}) => {
		if(c < 0 || c > 7 || r < 0 || r > 7) return;

		const detectingSlot = column[c] + row[r];
		const pieceDetected = pieces.find(p => p.slot === detectingSlot);

		if(pieceDetected && pieceDetected.team !== currentPiece.team){
			moves.push({c, r});
		}
	})

	const oneStep = {
		c: colIndex, r: rowIndex + 1
	}

	const targetSlot = column[oneStep.c] + row[oneStep.r];
	const oneStepBlock = pieces.find(p => p.slot === targetSlot);

	if(!oneStepBlock){
		moves.push(oneStep);

		if(rowIndex === 1){
			const twoStep = {
				c: colIndex, r: rowIndex + 2
			}

			const twoStepSlot = column[twoStep.c] + row[twoStep.r];
			const twoStepBlock = pieces.find(p => p.slot === twoStepSlot);

			if(!twoStepBlock){
				moves.push(twoStep);
			}
		}
	}
	return moves;
}

//=====BISHOP MOVES=====
function bishopMoves(colIndex, rowIndex, currentPiece, pieces, column, row){
	const bishop = [];

	const directions = [
		{dc: -1, dr: -1}, //northWest
		{dc: 1, dr: -1}, //northEast
		{dc: 1, dr: 1}, //southEast
		{dc: -1, dr: 1} //southWest
	]

	directions.forEach(({dc, dr}) => {
		let c = colIndex + dc;
		let r = rowIndex + dr;

		while(c >= 0 && c <= 7 && r >= 0 && r <= 7){
			const targetBox = column[c] + row[r];
			const blockingPiece = pieces.find(p => p.slot === targetBox);

			if(!blockingPiece){
				bishop.push({c, r});
			}
			else{
				if(blockingPiece.team !== currentPiece.team){
					bishop.push({c, r});
				}
				break;
			}
			c += dc;
			r += dr;
		}
	});
return bishop;
}

//=====KNIGHT MOVES=====
function knightMoves(colIndex, rowIndex, currentPiece, pieces, column, row){
	const moves = [];

	const directions = [
		{dc: -1, dr: -2},
		{dc: -2, dr: -1},
		{dc: 1, dr: -2},
		{dc: 2, dr: -1},
		{dc: -1, dr: 2},
		{dc: -2, dr: 1},
		{dc: 1, dr: 2},
		{dc: 2, dr: 1}
	]

	directions.forEach(({dc, dr}) => {
		const c = colIndex + dc;
		const r = rowIndex + dr;

		if(c < 0 || c > 7 || r < 0 || r > 7) return;

		const targetSlot = column[c] + row[r];
		const blockingPiece = pieces.find(p => p.slot === targetSlot);

		if(!blockingPiece || blockingPiece.team !== currentPiece.team){
			moves.push({c, r});
		}
	})
	return moves;
} 

//=====ROOK MOVES=====
function rookMoves(colIndex, rowIndex, currentPiece, pieces, column, row){
	const rook = [];

	const directions = [
		{dc: 0, dr: -1}, //North
		{dc: 1, dr: 0}, //East
		{dc: 0, dr: 1}, //South
		{dc: -1, dr: 0} //West
	]

	directions.forEach(({dc, dr}) => {

		let c = colIndex + dc;
		let r = rowIndex + dr;

		while(c >= 0 && c <= 7 && r >= 0 && r <= 7){
			const targetBox = column[c] + row[r];
			const blockingPiece = pieces.find(p => p.slot === targetBox);

			if(!blockingPiece){
				rook.push({c, r});
			}
			else{
				if(blockingPiece.team !== currentPiece.team){
					rook.push({c, r});
				}
				break;
			}
			c += dc;
			r += dr;
		}
	});
	return rook;
}

//=====QUEEN MOVES=====
function queenMoves(colIndex, rowIndex, currentPiece, pieces, column, row){
	const queen = [];

	const directions = [
		{dc: -1, dr: -1}, //northWest
		{dc: 1, dr: -1}, //northEast
		{dc: 1, dr: 1}, //southEast
		{dc: -1, dr: 1}, //southWest
		{dc: 0, dr: -1}, //North
		{dc: 1, dr: 0}, //East
		{dc: 0, dr: 1}, //South
		{dc: -1, dr: 0} //West
	]

	directions.forEach(({dc, dr}) => {
		let c = colIndex + dc;
		let r = rowIndex + dr;

		while(c >= 0 && c <= 7 && r >= 0 && r <= 7){
			const targetBox = column[c] + row[r];
			const blockingPiece = pieces.find(p => p.slot === targetBox);

			if(!blockingPiece){
				queen.push({c, r});
			}
			else{
				if(blockingPiece.team !== currentPiece.team){
					queen.push({c, r});
				}
				break;
			}
			c += dc;
			r += dr;
		}
	});
	return queen;
}

//=====KING MOVES=====
function kingMoves(colIndex, rowIndex, currentPiece, pieces,  column, row, skipCheckDetection = false){
	const moves = [];
	
	const directions = [
		{dc: -1, dr: -1},
		{dc: 0, dr: -1},
		{dc: 1, dr: -1},
		{dc: -1, dr: 0},
		{dc: 1, dr: 0},
		{dc: -1, dr: 1},
		{dc: 0, dr: 1},
		{dc: 1, dr: 1}
	];

	const attackedSlot = skipCheckDetection ? new Set() :
	getAttackedSquares(currentPiece.team === 1 ? 2 : 1, pieces.filter(p => p !== currentPiece), column, row);


	directions.forEach(({dc, dr}) => {
		const c = colIndex + dc;
		const r = rowIndex + dr;

		if(c < 0 || c > 7 || r < 0 || r > 7) return;

		const targetSlot = column[c] + row[r];
		const blockingPiece = pieces.find(p => p.slot === targetSlot);

		if(attackedSlot.has(targetSlot)) return;

		if(!blockingPiece || blockingPiece.team !== currentPiece.team){
			moves.push({c, r});
		}
	})

	if(!currentPiece.moved && !skipCheckDetection){

		const queenSideRook = pieces.find(p => p.team === currentPiece.team && p.type === "Rook" && p.slot[0] === "A" && !p.moved);
		const kingSideRook = pieces.find(p => p.team === currentPiece.team && p.type === "Rook" && p.slot[0] === "H" && !p.moved);

		if(queenSideRook){
			const path = [
				{c: colIndex - 1, r: rowIndex},
				{c: colIndex - 2, r: rowIndex},
				{c: colIndex - 3, r: rowIndex}
			];
			const pathClear = path.every(s => !pieces.find(p => p.slot === column[s.c] + row[s.r]));
			const pathSafe = path.every(s => !attackedSlot.has(column[s.c] + row[s.r]));

			if(pathClear && pathSafe){
				moves.push({c: colIndex - 2, r: rowIndex, castling: queenSideRook, newSlot: column[colIndex - 1] + row[rowIndex]});
			}
		}

		if(kingSideRook){
			const path = [
				{c: colIndex + 1, r: rowIndex},
				{c: colIndex + 2, r: rowIndex}
			];
			const pathClear = path.every(s => !pieces.find(p => p.slot === column[s.c] + row[s.r]));
			const pathSafe = path.every(s => !attackedSlot.has(column[s.c] + row[s.r]));

			if(pathClear && pathSafe){
				moves.push({c: colIndex + 2, r: rowIndex, castling: kingSideRook, newSlot: column[colIndex + 1] + row[rowIndex]});
			}
		}
	}
	return moves;
}

function getAttackedSquares(enemyTeam, pieces, column, row){
	const attacked = new Set();

	pieces.forEach(p => {
		if(p.team !== enemyTeam) return;

		const colIdx = column.indexOf(p.slot[0]);
		const rowIdx = row.indexOf(Number(p.slot[1]));

		let moves = [];

		switch(p.type){
			case "whitePawn":
				moves = [{c: colIdx - 1, r: rowIdx - 1}, {c: colIdx + 1, r: rowIdx - 1}];
				break;
			case "blackPawn":
				moves = [{c: colIdx - 1, r: rowIdx + 1}, {c: colIdx + 1, r: rowIdx + 1}];
				break;
			case "Bishop":
				moves = bishopMoves(colIdx, rowIdx, p, pieces, column, row);
				break;
			case "Knight":
				moves = knightMoves(colIdx, rowIdx, p, pieces, column, row);
				break;
			case "Rook":
				moves = rookMoves(colIdx, rowIdx, p, pieces, column, row);
				break;
			case "Queen":
				moves = queenMoves(colIdx, rowIdx, p, pieces, column, row);
				break;
			case "King":
				moves = kingMoves(colIdx, rowIdx, p, pieces, column, row, true);
				break;
		}

		moves.forEach(({c, r}) => {
			if(c >= 0 && c <= 7 && r >= 0 && r <= 7){
				attacked.add(column[c] + row[r]);
			}
		});
	})
	return attacked;
}

function App() {
	const {column, row, slots} = generateBoardSlots();
	const [slot, setSlot] = useState(slots);
	const [piece, setPiece] = useState(() => generatePieces(column, row));
	const [turnToMove, setTurnToMove] = useState(1);
	const [availableMoves, setAvailableMoves] = useState([]);

	//=====WHEN THE PIECE IS CLICKED=====//
	function togglePiece(name){
		let colIndex = null;
		let rowIndex = null;

		const clickedPiece = piece.find(p =>
			name === p.name && p.team === turnToMove
		);
		
		if(!clickedPiece){
			setSlot(prevSlot => 
				prevSlot.map(slot => 
					({...slot, clickable: false})
				)
			);
			return;
		}
		else{
			colIndex = column.indexOf(clickedPiece.slot[0]);
			rowIndex = row.indexOf(Number(clickedPiece.slot[1]));
			setPiece(prevPiece =>
				prevPiece.map(piece =>
					({...piece, clicked: name === piece.name ? !piece.clicked : false})
				)
			)
		}

		let moveThePiece = [];

		switch(clickedPiece.type){
			case "whitePawn":
				moveThePiece = whitePawnMoves(colIndex, rowIndex, clickedPiece, piece, column, row);
				break;
			case "blackPawn":
				moveThePiece = blackPawnMoves(colIndex, rowIndex, clickedPiece, piece, column, row);
				break;
			case "Bishop":
				moveThePiece = bishopMoves(colIndex, rowIndex, clickedPiece, piece, column, row);
				break;
			case "Knight":
				moveThePiece = knightMoves(colIndex, rowIndex, clickedPiece, piece, column, row);
				break;
			case "Rook":
				moveThePiece = rookMoves(colIndex, rowIndex, clickedPiece, piece, column, row);
				break;
			case "Queen":
				moveThePiece = queenMoves(colIndex, rowIndex, clickedPiece, piece, column, row);
				break;
			case "King":
				moveThePiece = kingMoves(colIndex, rowIndex, clickedPiece, piece, column, row);
				break;
		}
			
		setSlot(prevSlots =>
			prevSlots.map(s => {
				const moveMatch = moveThePiece.find(m => {
						if(m.c < 0 || m.c > 7 || m.r < 0 || m.r > 7) return false;
					
						return column[m.c] + row[m.r] === s.slot;
				});
				return moveMatch ? {...s, clickable: true} : {...s, clickable: false};
			})
		)

		setAvailableMoves(moveThePiece);
	}

	function movePiece(targetSlot){
		const selectedPiece = piece.find(p => p.clicked);

		if(!selectedPiece) return;

		const clickableSlot = slot.find(s => s.slot === targetSlot && s.clickable);

		if(!clickableSlot) return;

		const moveData = availableMoves.find(m => column[m.c] + row[m.r] === targetSlot);

		setPiece(prevPiece =>
			prevPiece
			.filter(p => !(p.slot === targetSlot && !p.clicked))
			.map(p => {
				if(p.clicked){
					return {...p, slot: targetSlot, clicked: false, moved: true}
				}
				if(moveData?.castling && p.name === moveData.castling.name){
					return {...p, slot: moveData.newSlot, moved: true}
				} 
				return p;
			})
		);

		setSlot(prevSlot => 
			prevSlot.map(s => (
				{...s, clickable: false}
			))
		);

		setTurnToMove(prevTurn => prevTurn === 1 ? 2 : 1);
	}

	return (
		<>
			<Board 
				slotNames={slot} 
				pieces={piece}
				togglePiece={togglePiece}
				movePiece={movePiece}
				greenDot={greenDot}
			/>
		</>
	)
}

export default App;
