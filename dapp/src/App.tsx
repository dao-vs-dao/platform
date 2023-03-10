import React from "react";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { Web3Button } from "@web3modal/react";

import { ToastContainer } from "react-toastify";
import { Disconnected } from "./pages/disconnected";
import logo from "./assets/logo.svg";
import "react-toastify/dist/ReactToastify.css";
import "./fonts.css";
import "./constants.css";
import "./app.css";
import "./shared.css";

// wallet config
const chains: any = true ? [polygonMumbai] : [polygon];
const projectId = "c163ea8f4790cd069a88fef24f76f3f7";
const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }) as any,
    provider
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

export const App = ({ children }: { children: any }) => {
    const { address, isConnected } = useAccount();

    return (
        <WagmiConfig client={wagmiClient}>
            {/* Header */}
            <div className="header">
                <img src={logo} alt="DaoVsDao logo" className="page-logo" />
                <div className="wallet-control">
                    <Web3Button />
                </div>
            </div>

            {/* Test environment message */}
            {false && (
                <div className="test-environment-warning">
                    NOTE: You are currently using a test environment!!
                </div>
            )}

            {/* Page */}
            <div className="page">
                {address && isConnected ? children : <Disconnected />}
            </div>

            <ToastContainer theme="colored" />
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} themeMode="dark" />
        </WagmiConfig>
    );
};
