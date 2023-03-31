import { faker } from "@faker-js/faker";
import React, { useEffect, useState } from "react";
import { IPlayer } from "../../@types/i-player";
import { PlayerCellPanel } from "../../components/cell-panel";
import { CertificatesList } from "../../components/certificates";
import { EmptyPyramid, PyramidWithFightingPlayers, PyramidWithPlayers } from "../../components/pyramids";

import chatImage from "../../assets/chat.png";

import "./styles.css";

const levelColors = ["#862e9c", "#5f3dc4", "#364fc7", "#1864ab", "#0b7285", "#087f5b", "#2b8a3e"];

const randomPlayer = (): IPlayer => ({
    address: faker.finance.ethereumAddress(),
    balance: faker.datatype.number({ min: 0.02, max: 3, precision: 0.001 }),
    claimable: faker.datatype.number({ min: 0.02, max: 3, precision: 0.001 }),
    sponsorships: faker.datatype.number({ min: 0.02, max: 3, precision: 0.001 }),
});

export const HomePage = () => {
    const [players, setPlayers] = useState<IPlayer[]>([randomPlayer(), randomPlayer(), randomPlayer(), randomPlayer()]);
    const [colorShift, setColorShift] = useState<number>(faker.datatype.number({min: 0, max: 4}));


    const randomize = () => {
        setPlayers([randomPlayer(), randomPlayer(), randomPlayer(), randomPlayer()]);
        setColorShift(faker.datatype.number({min: 0, max: 4}));
    };

    useEffect(() => {
        randomize();
    }, []);


    return (
        <div className="home-page">
            <div className="home-page__title"> DAO vs DAO</div>
            <div className="home-page__subtitle"> Lorem Ipsum</div>
            <div className="home-page__blocks">
                <div className="home-page__element">
                    <EmptyPyramid />
                </div>
                <div className="home-page__element">
                    [Game Description]
                </div>
                <div className="home-page__element">
                    [Rules]
                </div>
                <div className="home-page__element">
                    <PyramidWithPlayers players={players} colorShift={colorShift}/>
                </div>
                <div className="home-page__element">
                    < PlayerCellPanel player={players[0]} color={levelColors[colorShift]} />
                </div>
                <div className="home-page__element">
                    []
                </div>
                <div className="home-page__element">
                    []
                </div>
                <div className="home-page__element">
                    <PyramidWithFightingPlayers players={players}  />
                </div>
                <div className="home-page__element">
                    <CertificatesList />
                </div>
                <div className="home-page__element">
                    [Certificates rules]
                </div>
                <div className="home-page__element">
                    [Chat]
                </div>
                <div className="home-page__element">
                    <img className="chat-img" src={chatImage} />
                </div>
            </div>
        </div>
    );
};
