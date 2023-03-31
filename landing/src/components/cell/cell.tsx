import React from "react";

import "./styles.css";

interface ICellProps {
    row: number;
    left: number;
    colorShift?: number;
    isLocal?: boolean;
    hasRecoveryCoolDown?: boolean;
    hasAttackCoolDown?: boolean;
    address?: string;
    worth?: number;
}

const levelColors = ["#862e9c", "#5f3dc4", "#364fc7", "#1864ab", "#0b7285", "#087f5b", "#2b8a3e"];

export const Cell = ({
    row,
    left,
    colorShift,
    isLocal,
    hasRecoveryCoolDown,
    hasAttackCoolDown,
    address,
    worth
}: ICellProps) => {
    const top = row * 53;
    const colorIndex = (row + (colorShift ?? 0)) % levelColors.length;
    let cellTextColor = isLocal ? "#000" : levelColors[colorIndex];
    let fillColor = isLocal ? levelColors[colorIndex] : "#0000";
    let strokeColor = levelColors[colorIndex];

    if (hasRecoveryCoolDown) {
        cellTextColor = "#495057";
        strokeColor = "#495057";
    }
    if (hasAttackCoolDown) {
        cellTextColor = "#FF5376";
        strokeColor = "#FF5376";
    }

    return (
        <div className="cell" style={{ top: `${top}px`, left: `${left}px` }}>
            {/* Clickable component */}
            <div className="cell__hovering-surface" />

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
                    </rect>
                </g>
            </svg>

            {/* Cell content  */}
            {address ? (
                <div
                    className={`cell__content ${isLocal && "cell__content--highlighted"}`}
                >
                    <div className={`cell__address`} style={{ color: cellTextColor }}>{address}</div>
                    <div className={`cell__worth`} style={{ color: cellTextColor }}>{worth}</div>
                </div>
            ) : null}
        </div>
    );
};
