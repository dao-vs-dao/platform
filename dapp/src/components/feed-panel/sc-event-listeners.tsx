import React, { useEffect } from "react";
import { BigNumber, Contract } from "ethers";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useProvider } from "wagmi";

import { ICoords, pyramidDistance } from "../../@types/i-coords";
import { INews } from "../../@types/i-feed";
import { bigNumberToFloat } from "../../data/big-number-to-float";
import { compactAddress } from "../../data/compact-address";
import { getSCContract } from "../../data/sponsorship-certificate-contract";
import { pushNews } from "../../state/slices/feed-slice";
import { RootState } from "../../state/store";
import { retrieveGameState } from "../shared";
import { roundAtFifthDecimal } from "../../data/utils";

export const SCEventListener = () => {
    const dispatch = useDispatch();
    const provider = useProvider();
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);
    const playersByAddress = useSelector((state: RootState) => state.game.playersByAddress);

    const removeListeners = async () => {
        const scContract = await getSCContract(provider);
        scContract.removeAllListeners('CertificateEmitted');
        console.debug(`Removed listener for "CertificateEmitted" events`);

        scContract.removeAllListeners('CertificateRedeemed');
        console.debug(`Removed listener for "CertificateRedeemed" events`);
    };

    const addListeners = async () => {
        const scContract = await getSCContract(provider);

        scContract.on('CertificateEmitted', handleCertificateEmittedEvent);
        console.debug(`Listening to "CertificateEmitted" events`);

        scContract.on('CertificateRedeemed', handleCertificateRedeemedEvent);
        console.debug(`Listening to "CertificateRedeemed" events`);
    };

    const fetchLatestEvents = async () => {
        const scContract = await getSCContract(provider);
        const NR_BLOCKS = 10000;

        const certificateEmittedFilter = scContract.filters.CertificateEmitted();
        let certEmittedEvents = await scContract.queryFilter(certificateEmittedFilter, -NR_BLOCKS, "latest");
        certEmittedEvents.forEach(event => handleCertificateEmittedEvent(event.args![0], event.args![1], event.args![2], event.args![3], event.args![4], true));

        const certificateRedeemedFilter = scContract.filters.CertificateRedeemed();
        let certRedeemedEvents = await scContract.queryFilter(certificateRedeemedFilter, -NR_BLOCKS, "latest");
        certRedeemedEvents.forEach(event => handleCertificateRedeemedEvent(event.args![0], event.args![1], event.args![2], event.args![3], event.args![4], true));
    };

    const handleCertificateEmittedEvent = (sponsor: string, sponsorshipReceiver: string, amount: BigNumber, shares: BigNumber, certificateId: BigNumber, isOldEvent: boolean = false) => {
        const receiver = playersByAddress[sponsorshipReceiver];
        const newsPiece: INews = {
            id: uniqueId(),
            timestamp: isOldEvent ? undefined :  Date.now(),
            text: `${compactAddress(sponsor)} just sponsored ${compactAddress(sponsorshipReceiver)} for ${bigNumberToFloat(amount)} DVD`,
            unread: !isOldEvent,
            distance: calculateDistance(receiver?.coords)
        };
        console.log(Object.keys(playersByAddress));

        dispatch(pushNews({ news: newsPiece }));
        if (!isOldEvent) retrieveGameState(dispatch, provider, currentPlayer?.userAddress);
    };

    const handleCertificateRedeemedEvent = (redeemer: string, sponsorshipReceiver: string, initialAmount: BigNumber, redeemedAmount: BigNumber, certificateId: BigNumber, isOldEvent: boolean = false) => {
        const receiver = playersByAddress[sponsorshipReceiver];
        const profit = roundAtFifthDecimal(bigNumberToFloat(redeemedAmount) - bigNumberToFloat(initialAmount));
        const isProfit = profit > 0;
        const newsPiece: INews = {
            id: uniqueId(),
            timestamp: isOldEvent ? undefined :  Date.now(),
            text: `${compactAddress(redeemer)} just redeemed certificate #${certificateId}, from ${compactAddress(sponsorshipReceiver)} for a ${isProfit ? "profit" : "loss"} of ${Math.abs(profit)} DVD`,
            unread: !isOldEvent,
            distance: calculateDistance(receiver?.coords)
        };
        console.log(Object.keys(playersByAddress));

        dispatch(pushNews({ news: newsPiece }));
        if (!isOldEvent) retrieveGameState(dispatch, provider, currentPlayer?.userAddress);
    };

    const uniqueId = () => Math.floor(Math.random() * 10000000).toString();
    const calculateDistance = (coords?: ICoords): number | undefined => {
        if (!coords || !currentPlayer) return undefined;
        return pyramidDistance(currentPlayer.coords, coords);
    };

    useEffect(() => {
        addListeners();
        fetchLatestEvents();
        return () => void removeListeners();
    }, []);

    return <div id="id-sc-events-listener" />;
};
