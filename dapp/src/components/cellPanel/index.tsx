import React, { MutableRefObject, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { ICoords } from "../../@types/i-coords";
import { IPlayer } from "../../@types/i-player";
import { setSelectedCoords } from "../../state/slices/player-slice";
import { EmptyCellPanel } from "./empty-cell-panel";
import { PlayerCellPanel } from "./player-cell-panel";
import "./styles.css";

interface ICellPanelProps {
    color: string;
    coords: ICoords;
    player?: IPlayer;
}

export const CellPanel = ({ color, coords, player }: ICellPanelProps) => {
    const dispatch = useDispatch();
    const ref: MutableRefObject<any> = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current
                && !event.target?.className?.includes?.("cell__hovering-surface")
                && !ref.current.contains(event.target)) {
                dispatch(setSelectedCoords({ coords: undefined }));
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className={`cell-panel`} style={{ borderColor: color }} ref={ref}>
            {
                player
                    ? <PlayerCellPanel player={player} color={color} coords={coords} />
                    : <EmptyCellPanel color={color} coords={coords} />
            }
        </div>
    );
};
