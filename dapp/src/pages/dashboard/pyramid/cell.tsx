import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { coordToString, ICoords } from "../../../@types/i-coords";

import { calculateWorth } from "../../../@types/i-player";
import { CellPanel } from "../../../components/cellPanel";
import { compactAddress } from "../../../data/compact-address";
import { setSelectedCoords } from "../../../state/slices/player-slice";
import { RootState } from "../../../state/store";
import "./pyramid.css";

interface ICellProps {
    coords: ICoords;
}

const defaultColor = "#49505722";
const levelColors: { [distanceToTop: number]: string; } = {
    0: "#862e9c",
    1: "#5f3dc4",
    2: "#364fc7",
    3: "#1864ab",
    4: "#0b7285",
    5: "#087f5b",
    6: "#2b8a3e",
    7: "#5c940d"
};

export const Cell = ({ coords }: ICellProps) => {
    const dispatch = useDispatch();
    const { address } = useAccount();
    const animationDuration = useRef(Math.random() * 5 + 5);
    const distanceToTop = coords.row;
    const selectedCoords = useSelector((state: RootState) => state.player.selectedCoords);
    const strCoords = coordToString(coords);
    const isSelected = strCoords === selectedCoords;

    const playersFromCoords = useSelector((state: RootState) => state.game.playersByCoords);
    const cellPlayer = playersFromCoords[strCoords];
    const isLocalPlayerCell = cellPlayer?.userAddress === address;

    const cellTextColor = isLocalPlayerCell ? "#000" : `var(--l${distanceToTop})`;
    const fillColor = isLocalPlayerCell ? levelColors[distanceToTop] ?? defaultColor : isSelected ? "#fff1" : "#0000";
    const strokeColor = levelColors[distanceToTop] ?? defaultColor;

    const selectCell = () => {
        const selectedCoords = isSelected ? undefined : coordToString(coords);
        dispatch(setSelectedCoords({ coords: selectedCoords }));
    };

    return (
        <div className={`cell ${isSelected ? "cell--selected" : ""} ${isLocalPlayerCell ? "cell--local" : ""}`}>
            {/* Clickable component */}
            <div className="cell__hovering-surface" onClick={selectCell} />

            {/* Cell graphic */}
            <svg version="1.1" viewBox="0 0 80.536 98.214">
                <g>
                    <rect
                        className="cell__fillable"
                        transform="matrix(.63408 -.77327 .63408 .77327 0 0)"
                        x="-32.153"
                        y="30.998"
                        width="64.305"
                        height="65.016"
                        ry="3.187"
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth="1.5"
                    >
                        {/* <animate
                            attributeName="stroke"
                            values={`${strokeColor}; ${strokeColor}70; ${strokeColor};`}
                            dur={`${animationDuration.current}s`}
                            repeatCount="indefinite"
                        /> */}
                    </rect>
                </g>
            </svg>

            {/* Cell content  */}
            {cellPlayer ? (
                <div
                    className={`cell__content ${isLocalPlayerCell && "cell__content--highlighted"}`}
                >
                    <div className={`cell__address`} style={{ color: cellTextColor }}>
                        {compactAddress(cellPlayer.userAddress)}
                    </div>
                    <div className={`cell__worth`} style={{ color: cellTextColor }}>
                        {calculateWorth(cellPlayer)}
                    </div>
                </div>
            ) : null}

            {/* Cell details panel */}
            {
                !isSelected ? null : <CellPanel color={strokeColor} coords={coords} player={cellPlayer} />
            }
        </div>
    );
};
