import React from "react";
import { useSwitchNetwork } from "wagmi";

import "./styles.css";

export const WrongChainPage = ({ chainToUse }: { chainToUse: any; }) => {
    const { switchNetwork } = useSwitchNetwork();

    return (
        <div className="disconnected-page">
            <div className="disconnected-page__title typewriter">Wrong chain</div>
            <br /><br />
            <button
                className="ui-button"
                onClick={() => switchNetwork?.(chainToUse.id)}>
                Switch to {chainToUse.name}
            </button>
        </div>
    );
};
