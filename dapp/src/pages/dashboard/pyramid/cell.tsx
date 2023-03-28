import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { coordToString, ICoords } from "../../../@types/i-coords";

import { calculateWorth, IPlayer } from "../../../@types/i-player";
import { CellPanel } from "../../../components/cellPanel";
import { compactAddress } from "../../../data/compact-address";
import { hasAttackCoolDown, hasRecoveryCoolDown } from "../../../data/cooldowns";
import { setSelectedCoords } from "../../../state/slices/player-slice";
import { RootState } from "../../../state/store";
import "./pyramid.css";

interface ICellProps {
    coords: ICoords;
}

const defaultColor = "#49505722";
const levelColors = [
    "#862e9c",
    "#5f3dc4",
    "#364fc7",
    "#1864ab",
    "#0b7285",
    "#087f5b",
    "#2b8a3e",
    "#5c940d",
    "#8c8f0a",
    "#b6a50e",
    "#d6bb1d",
    "#e6ce38",
    "#e4de6d",
    "#c9d47f",
    "#9ec3a7",
    "#73b8d7",
    "#5185c2",
    "#6c7ec7",
    "#8667c2",
    "#a351b8",
  ];

export const Cell = ({ coords }: ICellProps) => {
    const dispatch = useDispatch();
    const { address } = useAccount();
    // const animationDuration = useRef(Math.random() * 5 + 5);
    const distanceToTop = coords.row;
    const selectedCoords = useSelector((state: RootState) => state.player.selectedCoords);
    const strCoords = coordToString(coords);
    const isSelected = strCoords === selectedCoords;

    const playersFromCoords = useSelector((state: RootState) => state.game.playersByCoords);
    const cellPlayer: IPlayer | undefined = playersFromCoords[strCoords];
    const isLocalPlayerCell = cellPlayer?.userAddress === address;

    const colorIndex = distanceToTop % levelColors.length;
    let cellTextColor = isLocalPlayerCell ? "#000" : levelColors[colorIndex];
    let fillColor = isLocalPlayerCell ? levelColors[colorIndex] ?? defaultColor : isSelected ? "#fff1" : "#0000";
    let strokeColor = levelColors[colorIndex] ?? defaultColor;

    const isSponsored = cellPlayer
        && useSelector((state: RootState) => state.sponsoring.sponsoredPlayers)
        [cellPlayer.userAddress];
    const isSponsoring = cellPlayer
        && useSelector((state: RootState) => state.sponsoring.sponsoringPlayers)
        [cellPlayer.userAddress];

    if (cellPlayer && hasRecoveryCoolDown(cellPlayer)) {
        cellTextColor = isLocalPlayerCell ? "#000" : "#495057";
        fillColor = isLocalPlayerCell ? "#495057" : fillColor;
        strokeColor = "#495057";
    }
    if (cellPlayer && hasAttackCoolDown(cellPlayer)) {
        cellTextColor = isLocalPlayerCell ? "#000" : "#FF5376";
        fillColor = isLocalPlayerCell ? "#FF5376" : fillColor;
        strokeColor = "#FF5376";
    }

    const selectCell = () => {
        const selectedCoords = isSelected ? undefined : coordToString(coords);
        dispatch(setSelectedCoords({ coords: selectedCoords }));
    };

    return (
        <div className={`cell${isSponsoring ? " cell--sponsoring" : ""} ${isSponsored && !isSponsoring ? " cell--sponsored" : ""}`}>
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
