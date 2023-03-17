import React, { Dispatch } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../state/store";
import { infoToast } from "../toaster";
import "./styles.css";

export const ReferralLink = () => {
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);
    const clicked = async () => {
        if (!currentPlayer) return;

        const address = currentPlayer.userAddress;
        const url = window.location.href;
        const index = url.indexOf("?");
        const cleanUrl = index !== -1 ? url.substring(0, index) : url;

        await navigator.clipboard.writeText(`${cleanUrl}?referral=${address}`);
        infoToast("Referral copied to the clipboard! You'll earn 30% of the participation fee of new users.");
    };

    if (!currentPlayer) return null;

    return (
        <div className="referral-link" onClick={clicked}>
            Refer & Earn
        </div>
    );
};
