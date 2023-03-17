import React from "react";
import { Web3Button } from "@web3modal/react";

import "./styles.css";

export const DisconnectedPage = () => {
    return (
        <div className="disconnected-page">
            <div className="disconnected-page__title">Connect your wallet bro</div>
            <br /><br />
            <Web3Button />
        </div>
    );
};
