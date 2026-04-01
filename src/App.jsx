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

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const COLUMN = ["A", "B", "C", "D", "E", "F", "G", "H"];
const ROW    = [8, 7, 6, 5, 4, 3, 2, 1];

// ─── BOARD SETUP ─────────────────────────────────────────────────────────────

function generateBoardSlots() {
	return ROW.flatMap((r) =>
		COLUMN.map((c) => ({ slot: `${c}${r}`, clickable: false }))
	);
}

function generatePieces() {
	const officials = [
		{ image: blackQueen,  imageClicked: blackQueenClicked,  name: "blackQueen",   type: "Queen", slot: "D8", team: 2, clicked: false },
		{ image: blackKing,   imageClicked: blackKingClicked,   name: "blackKing",    type: "King",  slot: "E8", team: 2, clicked: false, moved: false },
		{ image: blackBishop, imageClicked: blackBishopClicked, name: "blackBishop1", type: "Bishop",slot: "C8", team: 2, clicked: false },
		{ image: blackBishop, imageClicked: blackBishopClicked, name: "blackBishop2", type: "Bishop",slot: "F8", team: 2, clicked: false },
		{ image: blackKnight, imageClicked: blackKnightClicked, name: "blackKnight1", type: "Knight",slot: "B8", team: 2, clicked: false },
		{ image: blackKnight, imageClicked: blackKnightClicked, name: "blackKnight2", type: "Knight",slot: "G8", team: 2, clicked: false },
		{ image: blackRook,   imageClicked: blackRookClicked,   name: "blackRook1",   type: "Rook",  slot: "A8", team: 2, clicked: false, moved: false },
		{ image: blackRook,   imageClicked: blackRookClicked,   name: "blackRook2",   type: "Rook",  slot: "H8", team: 2, clicked: false, moved: false },
		{ image: whiteQueen,  imageClicked: whiteQueenClicked,  name: "whiteQueen",   type: "Queen", slot: "D1", team: 1, clicked: false },
		{ image: whiteKing,   imageClicked: whiteKingClicked,   name: "whiteKing",    type: "King",  slot: "E1", team: 1, clicked: false, moved: false },
		{ image: whiteBishop, imageClicked: whiteBishopClicked, name: "whiteBishop1", type: "Bishop",slot: "C1", team: 1, clicked: false },
		{ image: whiteBishop, imageClicked: whiteBishopClicked, name: "whiteBishop2", type: "Bishop",slot: "F1", team: 1, clicked: false },
		{ image: whiteKnight, imageClicked: whiteKnightClicked, name: "whiteKnight1", type: "Knight",slot: "B1", team: 1, clicked: false },
		{ image: whiteKnight, imageClicked: whiteKnightClicked, name: "whiteKnight2", type: "Knight",slot: "G1", team: 1, clicked: false },
		{ image: whiteRook,   imageClicked: whiteRookClicked,   name: "whiteRook1",   type: "Rook",  slot: "A1", team: 1, clicked: false, moved: false },
		{ image: whiteRook,   imageClicked: whiteRookClicked,   name: "whiteRook2",   type: "Rook",  slot: "H1", team: 1, clicked: false, moved: false },
	];

	const pawns = COLUMN.flatMap((c, i) => [
		{ image: blackPawn, imageClicked: blackPawnClicked, name: `blackPawn${i}`, type: "blackPawn", slot: `${c}7`, team: 2, clicked: false, moved: false },
		{ image: whitePawn, imageClicked: whitePawnClicked, name: `whitePawn${i}`, type: "whitePawn", slot: `${c}2`, team: 1, clicked: false, moved: false },
	]);

	return [...officials, ...pawns];
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function toSlot(c, r) {
	return COLUMN[c] + ROW[r];
}

function colOf(slot) {
	return COLUMN.indexOf(slot[0]);
}

function rowOf(slot) {
	return ROW.indexOf(Number(slot.slice(1)));
}

function inBounds(c, r) {
	return c >= 0 && c <= 7 && r >= 0 && r <= 7;
}

function pieceAt(slot, pieces) {
	return pieces.find(p => p.slot === slot) ?? null;
}

// ─── MOVE GENERATORS ─────────────────────────────────────────────────────────

function whitePawnMoves(c, r, piece, pieces, enPassantTarget) {
	const moves = [];

	// Diagonal captures (including en passant)
	for (const dc of [-1, 1]) {
		if (!inBounds(c + dc, r - 1)) continue;
		const target = toSlot(c + dc, r - 1);
		const blocker = pieceAt(target, pieces);
		if (blocker && blocker.team !== piece.team) {
			moves.push({ c: c + dc, r: r - 1 });
		} else if (target === enPassantTarget) {
			moves.push({ c: c + dc, r: r - 1, enPassant: true, captureSlot: toSlot(c + dc, r) });
		}
	}

	// Forward one step
	if (inBounds(c, r - 1) && !pieceAt(toSlot(c, r - 1), pieces)) {
		moves.push({ c, r: r - 1 });
		// Forward two steps from starting rank
		if (r === 6 && !pieceAt(toSlot(c, r - 2), pieces)) {
			moves.push({ c, r: r - 2, pawnDoubleMove: toSlot(c, r - 1) });
		}
	}

	return moves;
}

function blackPawnMoves(c, r, piece, pieces, enPassantTarget) {
	const moves = [];

	// Diagonal captures (including en passant)
	for (const dc of [-1, 1]) {
		if (!inBounds(c + dc, r + 1)) continue;
		const target = toSlot(c + dc, r + 1);
		const blocker = pieceAt(target, pieces);
		if (blocker && blocker.team !== piece.team) {
			moves.push({ c: c + dc, r: r + 1 });
		} else if (target === enPassantTarget) {
			moves.push({ c: c + dc, r: r + 1, enPassant: true, captureSlot: toSlot(c + dc, r) });
		}
	}

	// Forward one step
	if (inBounds(c, r + 1) && !pieceAt(toSlot(c, r + 1), pieces)) {
		moves.push({ c, r: r + 1 });
		// Forward two steps from starting rank
		if (r === 1 && !pieceAt(toSlot(c, r + 2), pieces)) {
			moves.push({ c, r: r + 2, pawnDoubleMove: toSlot(c, r + 1) });
		}
	}

	return moves;
}

function slidingMoves(c, r, piece, pieces, directions) {
	const moves = [];
	for (const { dc, dr } of directions) {
		let nc = c + dc, nr = r + dr;
		while (inBounds(nc, nr)) {
			const blocker = pieceAt(toSlot(nc, nr), pieces);
			if (!blocker) {
				moves.push({ c: nc, r: nr });
			} else {
				if (blocker.team !== piece.team) moves.push({ c: nc, r: nr });
				break;
			}
			nc += dc;
			nr += dr;
		}
	}
	return moves;
}

function bishopMoves(c, r, piece, pieces) {
	return slidingMoves(c, r, piece, pieces, [
		{ dc: -1, dr: -1 }, { dc: 1, dr: -1 },
		{ dc: 1, dr: 1 },   { dc: -1, dr: 1 },
	]);
}

function rookMoves(c, r, piece, pieces) {
	return slidingMoves(c, r, piece, pieces, [
		{ dc: 0, dr: -1 }, { dc: 1, dr: 0 },
		{ dc: 0, dr: 1 },  { dc: -1, dr: 0 },
	]);
}

function queenMoves(c, r, piece, pieces) {
	return slidingMoves(c, r, piece, pieces, [
		{ dc: -1, dr: -1 }, { dc: 1, dr: -1 }, { dc: 1, dr: 1 }, { dc: -1, dr: 1 },
		{ dc: 0, dr: -1 },  { dc: 1, dr: 0 },  { dc: 0, dr: 1 }, { dc: -1, dr: 0 },
	]);
}

function knightMoves(c, r, piece, pieces) {
	return [
		{ dc: -1, dr: -2 }, { dc: -2, dr: -1 },
		{ dc: 1,  dr: -2 }, { dc: 2,  dr: -1 },
		{ dc: -1, dr: 2  }, { dc: -2, dr: 1  },
		{ dc: 1,  dr: 2  }, { dc: 2,  dr: 1  },
	]
		.filter(({ dc, dr }) => inBounds(c + dc, r + dr))
		.filter(({ dc, dr }) => {
			const blocker = pieceAt(toSlot(c + dc, r + dr), pieces);
			return !blocker || blocker.team !== piece.team;
		})
		.map(({ dc, dr }) => ({ c: c + dc, r: r + dr }));
}

function kingMoves(c, r, piece, pieces, skipCheckDetection = false) {
	const moves = [];

	const attacked = skipCheckDetection
		? new Set()
		: getAttackedSquares(piece.team === 1 ? 2 : 1, pieces.filter(p => p !== piece));

	// Normal one-square moves
	for (const { dc, dr } of [
		{ dc: -1, dr: -1 }, { dc: 0, dr: -1 }, { dc: 1, dr: -1 },
		{ dc: -1, dr: 0  },                     { dc: 1, dr: 0  },
		{ dc: -1, dr: 1  }, { dc: 0, dr: 1  }, { dc: 1, dr: 1  },
	]) {
		const nc = c + dc, nr = r + dr;
		if (!inBounds(nc, nr)) continue;
		const target = toSlot(nc, nr);
		if (attacked.has(target)) continue;
		const blocker = pieceAt(target, pieces);
		if (!blocker || blocker.team !== piece.team) {
			moves.push({ c: nc, r: nr });
		}
	}

	// Castling
	if (!piece.moved && !skipCheckDetection) {
		const kingInCheck = attacked.has(piece.slot);

		if (!kingInCheck) {
			// Queen-side castling
			const qRook = pieces.find(p =>
				p.team === piece.team && p.type === "Rook" && p.slot[0] === "A" && !p.moved
			);
			if (qRook) {
				const path = [
					{ c: c - 1, r }, { c: c - 2, r }, { c: c - 3, r }
				];
				const pathClear = path.every(s => !pieceAt(toSlot(s.c, s.r), pieces));
				const pathSafe  = path.slice(0, 2).every(s => !attacked.has(toSlot(s.c, s.r)));
				if (pathClear && pathSafe) {
					moves.push({ c: c - 2, r, castling: qRook, newSlot: toSlot(c - 1, r) });
				}
			}

			// King-side castling
			const kRook = pieces.find(p =>
				p.team === piece.team && p.type === "Rook" && p.slot[0] === "H" && !p.moved
			);
			if (kRook) {
				const path = [{ c: c + 1, r }, { c: c + 2, r }];
				const pathClear = path.every(s => !pieceAt(toSlot(s.c, s.r), pieces));
				const pathSafe  = path.every(s => !attacked.has(toSlot(s.c, s.r)));
				if (pathClear && pathSafe) {
					moves.push({ c: c + 2, r, castling: kRook, newSlot: toSlot(c + 1, r) });
				}
			}
		}
	}

	return moves;
}

// ─── ATTACK / CHECK / CHECKMATE / STALEMATE ──────────────────────────────────

function getAttackedSquares(enemyTeam, pieces) {
	const attacked = new Set();

	pieces.forEach(p => {
		if (p.team !== enemyTeam) return;

		const c = colOf(p.slot);
		const r = rowOf(p.slot);
		let moves = [];

		switch (p.type) {
			case "whitePawn":
				moves = [{ c: c - 1, r: r - 1 }, { c: c + 1, r: r - 1 }];
				break;
			case "blackPawn":
				moves = [{ c: c - 1, r: r + 1 }, { c: c + 1, r: r + 1 }];
				break;
			case "Bishop": moves = bishopMoves(c, r, p, pieces); break;
			case "Knight": moves = knightMoves(c, r, p, pieces); break;
			case "Rook":   moves = rookMoves(c, r, p, pieces);   break;
			case "Queen":  moves = queenMoves(c, r, p, pieces);  break;
			case "King":   moves = kingMoves(c, r, p, pieces, true); break;
		}

		moves.forEach(({ c: mc, r: mr }) => {
			if (inBounds(mc, mr)) attacked.add(toSlot(mc, mr));
		});
	});

	return attacked;
}

function isKingInCheck(team, pieces) {
	const king = pieces.find(p => p.type === "King" && p.team === team);
	if (!king) return false;
	const attacked = getAttackedSquares(team === 1 ? 2 : 1, pieces);
	return attacked.has(king.slot);
}

// Get all legal moves for a team (respects check filtering)
function getAllLegalMoves(team, pieces, enPassantTarget) {
	const legalMoves = [];

	pieces.filter(p => p.team === team).forEach(p => {
		const c = colOf(p.slot);
		const r = rowOf(p.slot);
		let rawMoves = [];

		switch (p.type) {
			case "whitePawn": rawMoves = whitePawnMoves(c, r, p, pieces, enPassantTarget); break;
			case "blackPawn": rawMoves = blackPawnMoves(c, r, p, pieces, enPassantTarget); break;
			case "Bishop":    rawMoves = bishopMoves(c, r, p, pieces); break;
			case "Knight":    rawMoves = knightMoves(c, r, p, pieces); break;
			case "Rook":      rawMoves = rookMoves(c, r, p, pieces);   break;
			case "Queen":     rawMoves = queenMoves(c, r, p, pieces);  break;
			case "King":      rawMoves = kingMoves(c, r, p, pieces);   break;
		}

		rawMoves.forEach(move => {
			const targetSlot = toSlot(move.c, move.r);
			const simulated = simulateMove(pieces, p, targetSlot, move);
			if (!isKingInCheck(team, simulated)) {
				legalMoves.push({ piece: p, move });
			}
		});
	});

	return legalMoves;
}

// Simulate a move without modifying state
function simulateMove(pieces, movingPiece, targetSlot, moveData) {
	return pieces
		.filter(p => {
			if (p.slot === targetSlot && p !== movingPiece) return false; // capture
			if (moveData?.enPassant && p.slot === moveData.captureSlot) return false; // en passant capture
			return true;
		})
		.map(p => {
			if (p === movingPiece) return { ...p, slot: targetSlot };
			if (moveData?.castling && p.name === moveData.castling.name) return { ...p, slot: moveData.newSlot };
			return p;
		});
}

// ─── PROMOTION HELPERS ───────────────────────────────────────────────────────

const PROMOTION_PIECES = {
	1: [
		{ type: "Queen",  image: whiteQueen,  imageClicked: whiteQueenClicked  },
		{ type: "Rook",   image: whiteRook,   imageClicked: whiteRookClicked   },
		{ type: "Bishop", image: whiteBishop, imageClicked: whiteBishopClicked },
		{ type: "Knight", image: whiteKnight, imageClicked: whiteKnightClicked },
	],
	2: [
		{ type: "Queen",  image: blackQueen,  imageClicked: blackQueenClicked  },
		{ type: "Rook",   image: blackRook,   imageClicked: blackRookClicked   },
		{ type: "Bishop", image: blackBishop, imageClicked: blackBishopClicked },
		{ type: "Knight", image: blackKnight, imageClicked: blackKnightClicked },
	],
};

function needsPromotion(piece) {
	if (piece.type === "whitePawn" && piece.slot[1] === "8") return true;
	if (piece.type === "blackPawn" && piece.slot[1] === "1") return true;
	return false;
}

// ─── APP ─────────────────────────────────────────────────────────────────────

function App() {
	const [slots, setSlots]               = useState(() => generateBoardSlots());
	const [pieces, setPieces]             = useState(() => generatePieces());
	const [turnToMove, setTurnToMove]     = useState(1);
	const [availableMoves, setAvailableMoves] = useState([]);
	const [enPassantTarget, setEnPassantTarget] = useState(null); // slot string or null
	const [promotionPending, setPromotionPending] = useState(null); // { pieceName } or null
	const [gameStatus, setGameStatus]     = useState("playing"); // "playing" | "check" | "checkmate" | "stalemate"

	// ── After every move, update game status for the next player ──
	function updateGameStatus(nextTeam, newPieces, newEnPassant) {
		const inCheck = isKingInCheck(nextTeam, newPieces);
		const legalMoves = getAllLegalMoves(nextTeam, newPieces, newEnPassant);

		if (legalMoves.length === 0) {
			setGameStatus(inCheck ? "checkmate" : "stalemate");
		} else {
			setGameStatus(inCheck ? "check" : "playing");
		}
	}

	// ── Filter moves that would leave own king in check ──
	function getLegalMovesForPiece(p, rawMoves) {
		return rawMoves.filter(move => {
			const targetSlot = toSlot(move.c, move.r);
			const simulated = simulateMove(pieces, p, targetSlot, move);
			return !isKingInCheck(p.team, simulated);
		});
	}

	// ── Click a piece ──
	function togglePiece(name) {
		if (gameStatus === "checkmate" || gameStatus === "stalemate") return;

		const clicked = pieces.find(p => p.name === name && p.team === turnToMove);

		if (!clicked) {
			setPieces(prev => prev.map(p => ({ ...p, clicked: false })));
			setSlots(prev => prev.map(s => ({ ...s, clickable: false })));
			return;
		}

		const c = colOf(clicked.slot);
		const r = rowOf(clicked.slot);

		let rawMoves = [];
		switch (clicked.type) {
			case "whitePawn": rawMoves = whitePawnMoves(c, r, clicked, pieces, enPassantTarget); break;
			case "blackPawn": rawMoves = blackPawnMoves(c, r, clicked, pieces, enPassantTarget); break;
			case "Bishop":    rawMoves = bishopMoves(c, r, clicked, pieces); break;
			case "Knight":    rawMoves = knightMoves(c, r, clicked, pieces); break;
			case "Rook":      rawMoves = rookMoves(c, r, clicked, pieces);   break;
			case "Queen":     rawMoves = queenMoves(c, r, clicked, pieces);  break;
			case "King":      rawMoves = kingMoves(c, r, clicked, pieces);   break;
		}

		const legalMoves = getLegalMovesForPiece(clicked, rawMoves);

		setPieces(prev => prev.map(p => ({
			...p,
			clicked: p.name === name ? !p.clicked : false,
		})));

		setSlots(prev => prev.map(s => {
			const match = legalMoves.find(m => toSlot(m.c, m.r) === s.slot);
			return { ...s, clickable: !!match };
		}));

		setAvailableMoves(legalMoves);
	}

	// ── Move a piece ──
	function movePiece(targetSlot) {
		const selected = pieces.find(p => p.clicked);
		if (!selected) return;

		const clickable = slots.find(s => s.slot === targetSlot && s.clickable);
		if (!clickable) return;

		const moveData = availableMoves.find(m => toSlot(m.c, m.r) === targetSlot);

		// Build new pieces array
		let newPieces = pieces
			.filter(p => {
				if (p.slot === targetSlot && p !== selected) return false; // normal capture
				if (moveData?.enPassant && p.slot === moveData.captureSlot) return false; // en passant capture
				return true;
			})
			.map(p => {
				if (p === selected) return { ...p, slot: targetSlot, clicked: false, moved: true };
				if (moveData?.castling && p.name === moveData.castling.name) return { ...p, slot: moveData.newSlot, moved: true };
				return p;
			});

		// En passant target for next turn
		const newEnPassant = moveData?.pawnDoubleMove ?? null;

		// Clear highlights
		setSlots(prev => prev.map(s => ({ ...s, clickable: false })));
		setAvailableMoves([]);
		setEnPassantTarget(newEnPassant);

		// Check for pawn promotion
		const movedPiece = newPieces.find(p => p.name === selected.name);
		if (needsPromotion(movedPiece)) {
			setPieces(newPieces);
			setPromotionPending({ pieceName: movedPiece.name, team: movedPiece.team });
			// Don't switch turns yet — wait for promotion choice
			return;
		}

		const nextTeam = turnToMove === 1 ? 2 : 1;
		setPieces(newPieces);
		setTurnToMove(nextTeam);
		updateGameStatus(nextTeam, newPieces, newEnPassant);
	}

	// ── Pawn promotion choice ──
	function promotePawn(chosenType) {
		if (!promotionPending) return;

		const promotion = PROMOTION_PIECES[promotionPending.team].find(p => p.type === chosenType);

		const newPieces = pieces.map(p => {
			if (p.name !== promotionPending.pieceName) return p;
			return {
				...p,
				type: promotion.type,
				image: promotion.image,
				imageClicked: promotion.imageClicked,
				name: `${p.team === 1 ? "white" : "black"}${promotion.type}_promoted_${p.slot}`,
			};
		});

		const nextTeam = turnToMove === 1 ? 2 : 1;
		setPieces(newPieces);
		setPromotionPending(null);
		setTurnToMove(nextTeam);
		updateGameStatus(nextTeam, newPieces, enPassantTarget);
	}

	// ── Reset game ──
	function resetGame() {
		setSlots(generateBoardSlots());
		setPieces(generatePieces());
		setTurnToMove(1);
		setAvailableMoves([]);
		setEnPassantTarget(null);
		setPromotionPending(null);
		setGameStatus("playing");
	}

	// ─── STATUS BANNER ────────────────────────────────────────────────────────
	const statusMessage = {
		playing:   `${turnToMove === 1 ? "White" : "Black"}'s turn`,
		check:     `${turnToMove === 1 ? "White" : "Black"} is in check!`,
		checkmate: `Checkmate! ${turnToMove === 1 ? "Black" : "White"} wins!`,
		stalemate: "Stalemate! It's a draw.",
	}[gameStatus];

	return (
		<>
			

			{gameStatus === "checkmate" || gameStatus === "stalemate" ? (
				<div style={{ textAlign: "center", marginBottom: "8px" }}>
					<button onClick={resetGame} style={{ padding: "8px 20px", cursor: "pointer" }}>
						Play Again
					</button>
				</div>
			) : null}

			<Board
				statusMessage={statusMessage}
				slotNames={slots}
				pieces={pieces}
				togglePiece={togglePiece}
				movePiece={movePiece}
				greenDot={greenDot}
				promotionPending={promotionPending}
				PROMOTION_PIECES={PROMOTION_PIECES}
				promotePawn={promotePawn}
			/>
		</>
	);
}

export default App;
