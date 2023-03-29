import React, { useEffect } from "react";
import { BigNumber, Event } from "ethers";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useProvider } from "wagmi";

import { ICoords } from "../../@types/i-coords";
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

        dvdContract.on('RealmAdded', handleRealmAddedEvent);
        console.debug(`Listening to "RealmAdded" events`);

        dvdContract.on('RealmAdded', handleRowAddedEvent);
        console.debug(`Listening to "RowAdded" events`);

        dvdContract.on('UserPlaced', handleUserPlacedEvent);
        console.debug(`Listening to "UserPlaced" events`);

        dvdContract.on('Slashed', handleUserSlashedEvent);
        console.debug(`Listening to "Slashed" events`);
    };

    const fetchLatestEvents = async () => {
        const dvdContract = await getDVDContract(provider);
        const NR_BLOCKS = 100000;

        const realmAddedFilter = dvdContract.filters.RealmAdded();
        let realmAddedEvents = await dvdContract.queryFilter(realmAddedFilter, -NR_BLOCKS, "latest");
        realmAddedEvents.forEach(event => handleRealmAddedEvent(event.args![0], event, true));

        const rowAddedFilter = dvdContract.filters.RowAdded();
        let rowAddedEvents = await dvdContract.queryFilter(rowAddedFilter, -NR_BLOCKS, "latest");
        rowAddedEvents.forEach(event => handleRowAddedEvent(event.args![0], event.args![1], event, true));

        const userPlacedFilter = dvdContract.filters.UserPlaced();
        let userPlacedEvents = await dvdContract.queryFilter(userPlacedFilter, -NR_BLOCKS, "latest");
        userPlacedEvents.forEach(event => handleUserPlacedEvent(event.args![0], event.args![1], event.args![2], event.args![3], event, true));

        const userSlashedFilter = dvdContract.filters.Slashed();
        let userSlashedEvents = await dvdContract.queryFilter(userSlashedFilter, -NR_BLOCKS, "latest");
        userSlashedEvents.forEach(event => handleUserSlashedEvent(event.args![0], event.args![1], event.args![2], event.args![3], event.args![4], event.args![5], event.args![6], event, true));
    };

    const handleRealmAddedEvent = (
        realm: number,
        wholeEvent: Event,
        isOldEvent: boolean = false) => {
        const newsPiece: INews = {
            id: uniqueId(),
            timestamp: Date.now(),
            text: `A new realm has been added! Players will be able to start or migrate there. Which riches and challenges are awaiting the first colonists?`,
            unread: true,
            block: wholeEvent.blockNumber
        };
        dispatch(pushNews({ news: newsPiece }));
        if (!isOldEvent) retrieveGameState(dispatch, provider, currentPlayer?.userAddress);
    };

    const handleRowAddedEvent = (
        realm: number,
        row: number,
        wholeEvent: Event,
        isOldEvent: boolean = false) => {
        const newsPiece: INews = {
            id: uniqueId(),
            timestamp: Date.now(),
            text: `A new row has been added. New players will be able to start from there`,
            unread: true,
            block: wholeEvent.blockNumber
        };
        dispatch(pushNews({ news: newsPiece }));
        if (!isOldEvent) retrieveGameState(dispatch, provider, currentPlayer?.userAddress);
    };

    const handleUserPlacedEvent = (
        user: string,
        referrer: string,
        _coord: ICoords,
        usersCount: BigNumber,
        wholeEvent: Event,
        isOldEvent: boolean = false) => {
        const newsPiece: INews = {
            id: uniqueId(),
            timestamp: Date.now(),
            text: `${compactAddress(user)} has joined the game! It was referred by ${referrer}. There are now ${usersCount.toNumber()} users playing DaoVsDao`,
            unread: true,
            epicenter: user,
            block: wholeEvent.blockNumber
        };
        dispatch(pushNews({ news: newsPiece }));
        if (!isOldEvent) retrieveGameState(dispatch, provider, currentPlayer?.userAddress);
    };

    const handleUserSlashedEvent = (
        attacker: string,
        attacked: string,
        subtractedFromAttackedBalance: BigNumber,
        subtractedFromAttackedSponsorships: BigNumber,
        slashingTaxes: BigNumber,
        addedToAttackerBalance: BigNumber,
        addedToAttackerSponsorships: BigNumber,
        wholeEvent: Event,
        isOldEvent: boolean = false) => {
        const earned = roundAtFifthDecimal(bigNumberToFloat(subtractedFromAttackedBalance) + bigNumberToFloat(subtractedFromAttackedSponsorships));
        const newsPiece: INews = {
            id: uniqueId(),
            timestamp: Date.now(),
            text: `${compactAddress(attacker)} has attacked ${attacked}, earning ${earned} DVD. ${compactAddress(attacker)} is now vulnerable for 12h and  ${attacked} cannot be attacked for 24h.`,
            unread: true,
            epicenter: attacker,
            block: wholeEvent.blockNumber
        };
        dispatch(pushNews({ news: newsPiece }));
        if (!isOldEvent) retrieveGameState(dispatch, provider, currentPlayer?.userAddress);
    };

    const uniqueId = () => Math.floor(Math.random() * 10000000).toString();

    useEffect(() => {
        addListeners();
        fetchLatestEvents();
        return () => void removeListeners();
    }, []);

    return <div id="id-dvd-events-listener" />;
};
