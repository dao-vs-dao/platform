import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from "react-redux";
import { createRoot } from 'react-dom/client';
import { polygon, polygonMumbai } from "wagmi/chains";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { configureChains, createClient, WagmiConfig } from "wagmi";

import { App } from './App';
import { Dashboard } from "./pages/dashboard";
import { store } from "./state/store";
import { Web3Modal } from "@web3modal/react";

const container = document.getElementById('app-root');
const root = createRoot(container!);

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

root.render(
    <Provider store={store}>
        <WagmiConfig client={wagmiClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App><Dashboard /></App>} />
                </Routes>
            </BrowserRouter>

            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} themeMode="dark" />
        </WagmiConfig>
    </Provider>
);
