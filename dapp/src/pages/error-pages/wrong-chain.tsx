import React from "react";
import { Web3Button } from "@web3modal/react";
import { useSwitchNetwork } from "wagmi";

import "./styles.css";

export const WrongChainPage = ({ chainToUse }: { chainToUse: any; }) => {
    const { switchNetwork } = useSwitchNetwork();

    return (
        <div className="disconnected-page">
            <div className="disconnected-page__title">You need to set your wallet to the {chainToUse.name} chain</div>
            <br /><br />
            <button onClick={() => switchNetwork?.(chainToUse.id)}>Switch Network</button>
        </div>
    );
};
