import React from "react";
import { faker } from "@faker-js/faker";
import { compactAddress, getWorth, IPlayer } from "../../@types/i-player";
import { Cell } from "../cell/cell";

import "./styles.css";

export const EmptyPyramid = () => {
    return (
        <div className="pyramid" style={{ width: "382px", height: "262px" }}>
            <Cell left={150} row={0} />

            <Cell left={106} row={1} />
            <Cell left={194} row={1} />

            <Cell left={62} row={2} />
            <Cell left={150} row={2} />
            <Cell left={238} row={2} />

            <Cell left={18} row={3} />
            <Cell left={106} row={3} />
            <Cell left={194} row={3} />
            <Cell left={282} row={3} />
        </div>
    );
};

export const PyramidWithPlayers = ({ players, colorShift }: { players: IPlayer[], colorShift: number; }) => {
    const selected = faker.datatype.number({ min: 0, max: 3 });
    return (
        <div className="pyramid" style={{ width: "382px", height: "210px" }}>
            <Cell left={150}
                row={0}
                address={compactAddress(players[0].address)}
                worth={getWorth(players[0])}
                colorShift={colorShift}
                isLocal={selected === 0}
            />


            <Cell
                left={106}
                row={1}
                address={compactAddress(players[1].address)}
                worth={getWorth(players[1])}
                colorShift={colorShift}
                isLocal={selected === 1}
            />

            <Cell
                left={194}
                row={1}
                address={compactAddress(players[2].address)}
                worth={getWorth(players[2])}
                colorShift={colorShift}
                isLocal={selected === 2}
            />


            <Cell
                left={150}
                row={2}
                address={compactAddress(players[3].address)}
                worth={getWorth(players[3])}
                colorShift={colorShift}
                isLocal={selected === 3}
            />

        </div>
    );
};

export const PyramidWithFightingPlayers = ({ players }: { players: IPlayer[]; }) => {
    return (
        <div className="pyramid" style={{ width: "382px", height: "210px" }}>
            <Cell
                left={150}
                row={0}
                address={compactAddress(players[1].address)}
                worth={getWorth(players[1])}
                hasAttackCoolDown={true}
                />

            <Cell
                left={192}
                row={1}
                address={compactAddress(players[2].address)}
                worth={getWorth(players[2])}
                hasRecoveryCoolDown={true}
            />
        </div>
    );
};
