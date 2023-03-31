import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAccount, useProvider } from "wagmi";
import { CertificatesPanel } from "../../components/certificates-panel";
import { FeedPanel } from "../../components/feed-panel";
import { MessagesPanel } from "../../components/messages-panel";
import { RefocusButton } from "../../components/refocus-button";
import { RefreshButton } from "../../components/refresh-button";
import { retrieveGameState } from "../../components/shared";

import { Pyramid } from "./pyramid";
import "./styles.css";

export const Dashboard = () => {
    const dispatch = useDispatch();
    const { address } = useAccount();
    const provider = useProvider();

    useEffect(() => {
        retrieveGameState(dispatch, provider, address);
    }, [address]);

    return (
        <div className="dashboard">
            <Pyramid />

            <div className="dashboard__actions">
                <RefreshButton />
                <RefocusButton />
                <CertificatesPanel />
                <MessagesPanel />
                <FeedPanel />
            </div>
        </div>
    );
};
