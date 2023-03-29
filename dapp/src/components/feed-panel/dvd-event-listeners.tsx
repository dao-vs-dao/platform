import React, { useEffect } from "react";
import { Contract } from "ethers";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useProvider } from "wagmi";

import { BNToPOJOCoords, coordsFromLooseValues, ICoords, pyramidDistance } from "../../@types/i-coords";
import { INews } from "../../@types/i-feed";
import { bigNumberToFloat } from "../../data/big-number-to-float";
import { compactAddress } from "../../data/compact-address";
import { pushNews } from "../../state/slices/feed-slice";
import { RootState } from "../../state/store";
import { retrieveGameState } from "../shared";
import { getDVDContract } from "../../data/dao-vs-dao-contract";
import { roundAtFifthDecimal } from "../../data/utils";

export const DVDEventListener = () => {
    const dispatch = useDispatch();
    const provider = useProvider();
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);
    const playersByAddress = useSelector((state: RootState) => state.game.playersByAddress);

    const removeListeners = async () => {
        const dvdContract = await getDVDContract(provider);
        dvdContract.removeAllListeners('RealmAdded');
        console.debug(`Removed listener for "RealmAdded" events`);

        dvdContract.removeAllListeners('RowAdded');
        console.debug(`Removed listener for "RowAdded" events`);

        dvdContract.removeAllListeners('Slashed');
        console.debug(`Removed listener for "Slashed" events`);

        dvdContract.removeAllListeners('UserPlaced');
        console.debug(`Removed listener for "UserPlaced" events`);
    };

    const addListeners = async () => {
        const dvdContract = await getDVDContract(provider);
        await listenToRealmAdded(dvdContract);
        await listenToRowAdded(dvdContract);
        await listenToUserPlaced(dvdContract);
        await listenToUserSlashed(dvdContract);
    };

    const listenToRealmAdded = async (dvdContract: Contract) => {
        dvdContract.on('RealmAdded', (realm) => {
            const newsPiece: INews = {
                id: uniqueId(),
                timestamp: Date.now(),
                text: `A new realm has been added! Players will be able to start or migrate there. Which riches and challenges are awaiting the first colonists?`,
                unread: true,
                distance: 0
            };
            dispatch(pushNews({ news: newsPiece }));
            retrieveGameState(dispatch, provider, currentPlayer?.userAddress);
        });
        console.debug(`Listening to "RealmAdded" events`);
    };

    const listenToRowAdded = async (dvdContract: Contract) => {
        dvdContract.on('RowAdded', (realm, row) => {
            const newsPiece: INews = {
                id: uniqueId(),
                timestamp: Date.now(),
                text: `A new row has been added. New players will be able to start from there`,
                unread: true,
                distance: calculateDistance(coordsFromLooseValues(realm.toNumber(), row.toNumber(), currentPlayer?.coords.column ?? 0))
            };
            dispatch(pushNews({ news: newsPiece }));
            retrieveGameState(dispatch, provider, currentPlayer?.userAddress);
        });
        console.debug(`Listening to "RowAdded" events`);
    };

    const listenToUserPlaced = async (dvdContract: Contract) => {
        dvdContract.on('UserPlaced', (user, referrer, _coord, usersCount) => {
            const coords = BNToPOJOCoords(_coord);
            const newsPiece: INews = {
                id: uniqueId(),
                timestamp: Date.now(),
                text: `${compactAddress(user)} has joined the game! It was referred by ${referrer}. There are now ${usersCount} users playing DaoVsDao`,
                unread: true,
                distance: calculateDistance(coords)
            };
            dispatch(pushNews({ news: newsPiece }));
            retrieveGameState(dispatch, provider, currentPlayer?.userAddress);
        });
        console.debug(`Listening to "UserPlaced" events`);
    };

    const listenToUserSlashed = async (dvdContract: Contract) => {
        dvdContract.on('Slashed', (attacker, attacked, subtractedFromAttackedBalance, subtractedFromAttackedSponsorships, slashingTaxes, addedToAttackerBalance, addedToAttackerSponsorships) => {
            const attackingPlayer = playersByAddress[attacker];
            const earned = roundAtFifthDecimal(bigNumberToFloat(subtractedFromAttackedBalance) + bigNumberToFloat(subtractedFromAttackedSponsorships));
            const newsPiece: INews = {
                id: uniqueId(),
                timestamp: Date.now(),
                text: `${compactAddress(attacker)} has attacked ${attacked}, earning ${earned} DVD. ${compactAddress(attacker)} is now vulnerable for 12h and  ${attacked} cannot be attacked for 24h.`,
                unread: true,
                distance: calculateDistance(attackingPlayer?.coords)
            };
            dispatch(pushNews({ news: newsPiece }));
            retrieveGameState(dispatch, provider, currentPlayer?.userAddress);
        });
        console.debug(`Listening to "Slashed" events`);
    };

    const uniqueId = () => Math.floor(Math.random() * 10000000).toString();
    const calculateDistance = (coords?: ICoords): number | undefined => {
        if (!coords || !currentPlayer) return undefined;
        return pyramidDistance(currentPlayer.coords, coords);
    };

    useEffect(() => {
        addListeners();
        return () => void removeListeners();
    }, []);

    return <div id="id-dvd-events-listener" />;
};
