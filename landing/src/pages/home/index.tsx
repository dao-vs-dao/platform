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
    const [colorShift, setColorShift] = useState<number>(faker.datatype.number({ min: 0, max: 4 }));


    const randomize = () => {
        setPlayers([randomPlayer(), randomPlayer(), randomPlayer(), randomPlayer()]);
        setColorShift(faker.datatype.number({ min: 0, max: 4 }));
    };

    useEffect(() => {
        randomize();
    }, []);


    return (
        <div className="home-page">
            <div className="home-page__title"> DAO vs DAO</div>
            <div className="home-page__subtitle">Battle of the DAOs: Rise to the Apex</div>
            <div className="home-page__blocks">

                <div className="home-page__row">
                    <div className="home-page__element">
                        <EmptyPyramid />
                    </div>
                    <div className="home-page__element home-page__element--text">
                        Unleash the power of decentralized alliances in DaoVsDao,
                        an immersive blockchain game that challenges you to strategize,
                        climb the ranks, and dominate the map alongside your allies.
                        Test the limits of DAO structures and explore new ways to organize
                        in this thrilling, high-stakes competition for resources.
                    </div>
                </div>
                <div className="home-page__section-title">Rules</div>
                <div className="home-page__row home-page__row--reverse">
                    <div className="home-page__element">
                        <PyramidWithPlayers players={players} colorShift={colorShift} />
                    </div>
                    <div className="home-page__element home-page__element--text">
                        <ol>
                            <li>Select a starting location on the triangular map; the higher your position, the greater your earnings.</li>
                            <li>Earn DVD tokens, the game's currency, by playing and climbing the map.</li>
                        </ol>
                    </div>
                </div>
                <div className="home-page__row">
                    <div className="home-page__element">
                        < PlayerCellPanel player={players[0]} color={levelColors[colorShift]} />
                    </div>
                    <div className="home-page__element home-page__element--text">
                        <ol start={3}>
                            <li>Power is determined by the amount of DVD tokens held; attack neighbors with fewer tokens to seize a percentage of their tokens and swap your position.</li>
                            <li>DVD tokens are ERC20 tokens that can be traded, lent, or placed in liquidity pools.</li>
                        </ol>
                    </div>
                </div>
                <div className="home-page__row home-page__row--reverse">
                    <div className="home-page__element">
                        <PyramidWithFightingPlayers players={players} />
                    </div>
                    <div className="home-page__element home-page__element--text">
                        <ol start={5}>
                            <li>Players enter a 24-hour recovery state after being attacked, and a 12-hour dormant state after attacking with a double penalty if attacked during this period.</li>
                        </ol>
                    </div>
                </div>
                <div className="home-page__section-title">Features</div>
                <div className="home-page__row">
                    <div className="home-page__element">
                        <CertificatesList />
                    </div>
                    <div className="home-page__element home-page__element--text">
                        <ol>
                            <li>Sponsorships: Lend DVD tokens to other players and participate in their profits, or risk losing part of your lending in case of attack.</li>
                            <li>NFT Sponsorships: Track sponsorships via NFTs, which can be bought, sold, and exchanged on <a className="link" target="_blank" href="https://testnets.opensea.io/collection/dvd-sponsorship-certificate">OpenSea</a>.</li>
                        </ol>
                    </div>
                </div>
                <div className="home-page__row home-page__row--reverse">
                    <div className="home-page__element">
                        <img className="chat-img" src={chatImage} />
                    </div>
                    <div className="home-page__element home-page__element--text">
                        <ol start={3}>
                            <li>In-game chat: Communicate with neighboring players through the chat feature, and move conversations to more secure platforms if necessary.</li>
                            <li>News Feed: Keep up-to-date on the latest moves and strategies of other players in the game.</li>
                        </ol>
                    </div>
                </div>
                <div className="home-page__element home-page__element--conclusion home-page__element--text">
                    DaoVsDao is a groundbreaking strategy game that emphasizes collaboration,
                    resource management, and innovative DAO structures. Engage with other players,
                    forge powerful alliances, and battle your way to the top in this exciting,
                    ever-evolving game.
                    <br/><br/>
                    Are you ready to prove your worth in the Battle of the DAOs?
                </div>
            </div>

            <div style={{display:"flex", justifyContent: "center", marginTop: "30px"}}>
                <a href="https://game.daovsdao.xyz" className="ui-button ui-button--bigger">Play Now</a>
            </div>
        </div>
    );
};
