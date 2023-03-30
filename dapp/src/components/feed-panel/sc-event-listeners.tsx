import React, { useEffect } from "react";
import { BigNumber, Event } from "ethers";
import { useDispatch } from "react-redux";
import { useAccount, useProvider } from "wagmi";

import { INews } from "../../@types/i-feed";
import { bigNumberToFloat } from "../../data/big-number-to-float";
import { compactAddress } from "../../data/compact-address";
import { getSCContract } from "../../data/sponsorship-certificate-contract";
import { pushNews } from "../../state/slices/feed-slice";
import { retrieveGameState } from "../shared";
import { roundAtFifthDecimal } from "../../data/utils";
import { NR_BLOCKS } from "./shared";

export const SCEventListener = () => {
    const dispatch = useDispatch();
    const provider = useProvider();
    const { address } = useAccount();

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

        const certificateEmittedFilter = scContract.filters.CertificateEmitted();
        let certEmittedEvents = await scContract.queryFilter(certificateEmittedFilter, -NR_BLOCKS, "latest");
        certEmittedEvents.forEach(event => handleCertificateEmittedEvent(event.args![0], event.args![1], event.args![2], event.args![3], event.args![4], event, true));

        const certificateRedeemedFilter = scContract.filters.CertificateRedeemed();
        let certRedeemedEvents = await scContract.queryFilter(certificateRedeemedFilter, -NR_BLOCKS, "latest");
        certRedeemedEvents.forEach(event => handleCertificateRedeemedEvent(event.args![0], event.args![1], event.args![2], event.args![3], event.args![4], event, true));
    };

    const handleCertificateEmittedEvent = (
        sponsor: string,
        sponsorshipReceiver: string,
        amount: BigNumber,
        shares: BigNumber,
        certificateId: BigNumber,
        wholeEvent: Event,
        isOldEvent: boolean = false) => {
        const newsPiece: INews = {
            id: uniqueId(),
            timestamp: isOldEvent ? undefined : Date.now(),
            text: `${compactAddress(sponsorshipReceiver)} has been sponsored by ${compactAddress(sponsor)}, for ${bigNumberToFloat(amount)} DVD`,
            unread: !isOldEvent,
            block: wholeEvent.blockNumber,
            epicenter: sponsorshipReceiver
        };
        dispatch(pushNews({ news: newsPiece }));
        if (!isOldEvent && address !== sponsor) retrieveGameState(dispatch, provider, address);
    };

    const handleCertificateRedeemedEvent = (
        redeemer: string,
        sponsorshipReceiver: string,
        initialAmount: BigNumber,
        redeemedAmount: BigNumber,
        certificateId: BigNumber,
        wholeEvent: Event,
        isOldEvent: boolean = false) => {
        const profit = roundAtFifthDecimal(bigNumberToFloat(redeemedAmount) - bigNumberToFloat(initialAmount));
        const isProfit = profit > 0;
        const newsPiece: INews = {
            id: uniqueId(),
            timestamp: isOldEvent ? undefined : Date.now(),
            text: `${compactAddress(redeemer)} just redeemed certificate #${certificateId}, from ${compactAddress(sponsorshipReceiver)} for a ${isProfit ? "profit" : "loss"} of ${Math.abs(profit)} DVD`,
            unread: !isOldEvent,
            block: wholeEvent.blockNumber,
            epicenter: redeemer
        };
        dispatch(pushNews({ news: newsPiece }));
        if (!isOldEvent && address !== redeemer) retrieveGameState(dispatch, provider, address);
    };

    const uniqueId = () => Math.floor(Math.random() * 10000000).toString();

    useEffect(() => {
        addListeners();
        fetchLatestEvents();
        return () => void removeListeners();
    }, []);

    return <div id="id-sc-events-listener" />;
};
