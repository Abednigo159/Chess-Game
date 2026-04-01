import React from "react";
import style from "./Board.module.css";

export default function Board({slotNames, pieces, togglePiece, movePiece, greenDot, statusMessage, promotionPending, PROMOTION_PIECES, promotePawn, gameStatus, resetGame}){
  	return (<>
		<div className={style.status}>{statusMessage}</div>
		
		<div className={style.board}>
			{slotNames.map((slotName, index) => {
				const row = Math.floor(index / 8);
				const column = index % 8;
				const isWhite = (row + column) % 2 === 0;

				const placement = pieces.find(piece => piece.slot === slotName.slot);
				return(
					<div key={index} className={isWhite ? style.whiteSlot : style.blackSlot}>
						{placement &&
							<img className={style.piecesImage} src={
							placement.clicked ? placement.imageClicked : placement.image} 
							alt={placement.name} 
							onClick={() => {
								if(slotName.clickable){
									movePiece(slotName.slot)
								}
								else{
									togglePiece(placement.name)
								}
							}}/>
						}
						{!placement && slotName.clickable && (
							<img className={style.greenDot}src={greenDot} 
							alt="possible move" 
							onClick={() => movePiece(slotName.slot)}/>
							)
						}
					</div>
				);
			})}
		</div>

		{promotionPending && (
			<div className={style.promotionOption}>
				<h2>Promote Pawn</h2>
				<div>
					{PROMOTION_PIECES[promotionPending.team].map(({ type, image }) => (
						<button key={type} onClick={() => promotePawn(type)}>
							<img src={image} alt={type}/>
							<span>{type}</span>
						</button>
					))}
				</div>
			</div>
		)}

		{gameStatus === "checkmate" || gameStatus === "stalemate" ? (
			<button className={style.resetButton} onClick={resetGame} style={{ padding: "8px 20px", cursor: "pointer" }}>
				Play Again
			</button>
		) : null}
	</>);
}