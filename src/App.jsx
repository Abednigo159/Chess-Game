import { useState } from 'react'
import Board from "./board/Board.jsx";
import style from "./App.module.css";

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
		{image: blackKing, imageClicked: blackKingClicked,name: "blackKing", type: "King", slot: `${column[4]}${row[0]}`, team: 2, clicked: false},
		{image: blackBishop, imageClicked: blackBishopClicked, name: "blackBishop1", type: "Bishop", slot: `${column[2]}${row[0]}`, team: 2, clicked: false},
		{image: blackBishop, imageClicked: blackBishopClicked, name: "blackBishop2", type: "Bishop", slot: `${column[5]}${row[0]}`, team: 2, clicked: false},
		{image: blackKnight, imageClicked: blackKnightClicked, name: "blackKnight1", type: "Knight", slot: `${column[1]}${row[0]}`, team: 2, clicked: false},
		{image: blackKnight, imageClicked: blackKnightClicked, name: "blackKnight2", type: "Knight", slot: `${column[6]}${row[0]}`, team: 2, clicked: false},
		{image: blackRook, imageClicked: blackRookClicked, name: "blackRook1", type: "Rook", slot: `${column[0]}${row[0]}`, team: 2, clicked: false},
		{image: blackRook, imageClicked: blackRookClicked, name: "blackRook2", type: "Rook", slot: `${column[7]}${row[0]}`, team: 2, clicked: false},
		{image: whiteQueen, imageClicked: whiteQueenClicked, name: "whiteQueen", type: "Queen", slot: `${column[3]}${row[7]}`, team: 1, clicked: false},
		{image: whiteKing, imageClicked: whiteKingClicked, name: "whiteKing", type: "King", slot: `${column[4]}${row[7]}`, team: 1, clicked: false},
		{image: whiteBishop, imageClicked: whiteBishopClicked, name: "whiteBishop1", type: "Bishop", slot: `${column[2]}${row[7]}`, team: 1, clicked: false},
		{image: whiteBishop, imageClicked: whiteBishopClicked, name: "whiteBishop2", type: "Bishop", slot: `${column[5]}${row[7]}`, team: 1, clicked: false},
		{image: whiteKnight, imageClicked: whiteKnightClicked, name: "whiteKnight1", type: "Knight", slot: `${column[1]}${row[7]}`, team: 1, clicked: false},
		{image: whiteKnight, imageClicked: whiteKnightClicked, name: "whiteKnight2", type: "Knight", slot: `${column[6]}${row[7]}`, team: 1, clicked: false},
		{image: whiteRook, imageClicked: whiteRookClicked, name: "whiteRook1", type: "Rook", slot: `${column[0]}${row[7]}`, team: 1, clicked: false},
		{image: whiteRook, imageClicked: whiteRookClicked, name: "whiteRook2", type: "Rook", slot: `${column[7]}${row[7]}`, team: 1, clicked: false}
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

function App() {
	const {column, row, slots} = generateBoardSlots();
	const [slot, setSlot] = useState(slots);
	const [piece, setPiece] = useState(() => generatePieces(column, row));
	const [turnToMove, setTurnToMove] = useState(1);

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

		//=====PAWN MOVES=====
		function whitePawnMoves(colIndex, rowIndex){
			const moves = [];

			const detectEnemy = [
				{c: colIndex - 1, r: rowIndex - 1},
				{c: colIndex + 1, r: rowIndex - 1}
			]

			detectEnemy.forEach(({c, r}) => {
				if(c < 0 || c > 7 || r < 0 || r > 7) return;

				const detectingSlot = column[c] + row[r];
				const pieceDetected = piece.find(p => p.slot === detectingSlot);

				if(pieceDetected && pieceDetected.team !== clickedPiece.team){
					moves.push({c, r});
				}
			})

			const oneStep = {
				c: colIndex, r: rowIndex - 1
			}

			const oneStepSlot = column[oneStep.c] + row[oneStep.r];
			const oneStepBlock = piece.find(p => p.slot === oneStepSlot);

			if(!oneStepBlock){
				moves.push(oneStep);

				if(rowIndex === 6){
					const twoStep = {
						c: colIndex, r: rowIndex - 2 
					};

					const twoStepSlot = column[twoStep.c] + row[twoStep.r];
					const twoStepBlock = piece.find(p => p.slot === twoStepSlot);

					if(!twoStepBlock) moves.push(twoStep);
				}
			}
			return moves;
		}

		
		function blackPawnMoves(colIndex, rowIndex){
			const moves = [];

			const detectEnemy = [
				{c: colIndex - 1, r: rowIndex + 1},
				{c: colIndex + 1, r: rowIndex + 1}
			]

			detectEnemy.forEach(({c, r}) => {
				if(c < 0 || c > 7 || r < 0 || r > 7) return;

				const detectingSlot = column[c] + row[r];
				const pieceDetected = piece.find(p => p.slot === detectingSlot);

				if(pieceDetected && pieceDetected.team !== clickedPiece.team){
					moves.push({c, r});
				}
			})

			const oneStep = {
				c: colIndex, r: rowIndex + 1
			}

			const targetSlot = column[oneStep.c] + row[oneStep.r];
			const oneStepBlock = piece.find(p => p.slot === targetSlot);

			if(!oneStepBlock){
				moves.push(oneStep);

				if(rowIndex === 1){
					const twoStep = {
						c: colIndex, r: rowIndex + 2
					}

					const twoStepSlot = column[twoStep.c] + row[twoStep.r];
					const twoStepBlock = piece.find(p => p.slot === twoStepSlot);

					if(!twoStepBlock){
						moves.push(twoStep);
					}
				}
				return moves;
			}
		}

		//=====BISHOP MOVES=====
		function bishopMoves(colIndex, rowIndex){
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
					const blockingPiece = piece.find(p => p.slot === targetBox);

					if(!blockingPiece){
						bishop.push({c, r});
					}
					else{
						if(blockingPiece.team !== clickedPiece.team){
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
		const knightMoves = [
			{c: colIndex - 1, r: rowIndex - 2},
			{c: colIndex - 2, r: rowIndex - 1},
			{c: colIndex + 1, r: rowIndex - 2},
			{c: colIndex + 2, r: rowIndex - 1},
			{c: colIndex - 1, r: rowIndex + 2},
			{c: colIndex - 2, r: rowIndex + 1},
			{c: colIndex + 1, r: rowIndex + 2},
			{c: colIndex + 2, r: rowIndex + 1}
		]

		//=====ROOK MOVES=====
		function rookMoves(colIndex, rowIndex){
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
					const blockingPiece = piece.find(p => p.slot === targetBox);

					if(!blockingPiece){
						rook.push({c, r});
					}
					else{
						if(blockingPiece.team !== clickedPiece.team){
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
		function queenMoves(colIndex, rowIndex){
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
					const blockingPiece = piece.find(p => p.slot === targetBox);

					if(!blockingPiece){
						queen.push({c, r});
					}
					else{
						if(blockingPiece.team !== clickedPiece.team){
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
		const kingMoves = [
			{c: colIndex - 1, r: rowIndex - 1},
			{c: colIndex, r: rowIndex - 1},
			{c: colIndex + 1, r: rowIndex - 1},
			{c: colIndex + 1, r: rowIndex},
			{c: colIndex + 1, r: rowIndex + 1},
			{c: colIndex, r: rowIndex + 1},
			{c: colIndex - 1, r: rowIndex + 1},
			{c: colIndex -1, r: rowIndex}
		]

		if(clickedPiece){
			switch(clickedPiece.type){
				case "whitePawn":
					moveThePiece = whitePawnMoves(colIndex, rowIndex);
					break;
				case "blackPawn":
					moveThePiece = blackPawnMoves(colIndex, rowIndex);
					break;
				case "Bishop":
					moveThePiece = bishopMoves(colIndex, rowIndex);
					break;
				case "Knight":
					moveThePiece = knightMoves;
					break;
				case "Rook":
					moveThePiece = rookMoves(colIndex, rowIndex);
					break;
				case "Queen":
					moveThePiece = queenMoves(colIndex, rowIndex);
					break;
				case "King":
					moveThePiece = kingMoves;
					break;
			}
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
	}

	function movePiece(targetSlot){
		const selectedPiece = piece.find(p => p.clicked);

		if(!selectedPiece) return;

		const clickableSlot = slot.find(s => s.slot === targetSlot && s.clickable);

		if(!clickableSlot) return;

		setPiece(prevPiece =>
			prevPiece
			.filter(p => !(p.slot === targetSlot && !p.clicked))
			.map(p => p.clicked ? {...p, slot: targetSlot, clicked: false} : p)
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
