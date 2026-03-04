import React from "react";
import style from "./Board.module.css";

export default function Board({slotNames, pieces, togglePiece, movePiece, greenDot}){
  	return (
    <div className={style.board}>
		{slotNames.map((slotName, index) => {
			const row = Math.floor(index / 8);
			const column = index % 8;
			const isWhite = (row + column) % 2 === 0;

			const placement = pieces.find(piece => piece.slot === slotName.slot);
			return(
				<div key={index} className={isWhite ? style.whiteSlot : style.blackSlot}>
					{placement &&
						<img src={
						placement.clicked ? placement.imageClicked : placement.image} 
						alt={placement.name} 
						onClick={() => togglePiece(placement.name)}/>
					}
					{!placement && slotName.clickable && (
						<img src={greenDot} 
						alt="possible move" 
						onClick={() => movePiece(slotName.slot)}/>
						)
					}
				</div>
			);
		})}
	</div>
	);
}
