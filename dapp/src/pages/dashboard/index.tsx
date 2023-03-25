import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAccount, useProvider } from "wagmi";
import { CertificatesPanel } from "../../components/certificates-panel";
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
            <CertificatesPanel />
        </div>
    );
};
