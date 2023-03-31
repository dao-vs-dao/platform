import React from "react";
import { useSelector } from "react-redux";

import { canSwap, coordToString, ICoords } from "../../@types/i-coords";
import { RootState } from "../../state/store";
import { FocusAction } from "./actions/focus-action";
import { StartGameAction } from "./actions/start-game-action";
import { SwapAction } from "./actions/swap-action";
import "./styles.css";

interface IEmptyCellPanelProps {
    color: string;
    coords: ICoords;
}

export const EmptyCellPanel = ({ coords, color }: IEmptyCellPanelProps) => {
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);
    const focus = useSelector((state: RootState) => state.game.focus);
    const game = useSelector((state: RootState) => state.game.gameData);
    const canPlayerSwapHere = currentPlayer && canSwap(currentPlayer.coords, coords);
    const canPlayerFocusHere = game && game.players.length > 20 && (!focus || coordToString(focus) !== coordToString(coords));
    const hasActions = !currentPlayer || canPlayerSwapHere || canPlayerFocusHere;

    return (
        <div className="cell-stats">
            {/* Title */}
            <div className="cell-stats__title" style={{ color: color }}>
                Empty Area [{coords.row}, {coords.column}]
            </div>

            {hasActions
                ? <>
                    {/* Actions */}
                    <div className="cell-stats__space" />
                    <div className="cell-stats__line" style={{ borderColor: color }} />
                    <div className="cell-stats__subtitle" style={{ color: color }}>Actions:</div>
                    <div className="cell-stats__actions">
                        <StartGameAction color={color} coords={coords} />
                        <SwapAction color={color} coords={coords} />
                        <FocusAction color={color} coords={coords} />
                    </div>
                </>
                : null // the player exists and it is not possible to swap here, so we just hide the actions
            }
        </div>
    );
};
