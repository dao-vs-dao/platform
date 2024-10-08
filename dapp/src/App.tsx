import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Web3Button } from "@web3modal/react";
import { polygon, polygonMumbai } from "wagmi/chains";
import { useAccount, useNetwork } from "wagmi";

import { RootState } from "./state/store";
import { setAuthAddress } from "./state/slices/player-slice";
import { Toaster } from 'react-hot-toast';
import { UnauthenticatedPage } from "./pages/error-pages/unlogged";
import { DisconnectedPage } from "./pages/error-pages/disconnected";
import logo from "./assets/logo.svg";
import "./fonts.css";
import "./constants.css";
import "./app.css";
import "./shared.css";
import { WrongChainPage } from "./pages/error-pages/wrong-chain";
import { getLoggedUser } from "./services/authentication";
import { ReferralLink } from "./components/referral";

const blastSepolia = {
    id: 168587773,
    name: "Blast Sepolia",
    network: "blast_sepolia",
    nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
    },
    rpcUrls: {},
    blockExplorers: {
        etherscan: {
            name: "BlastScan",
            url: "https://testnet.blastscan.io/",
        },
        default: {
            name: "BlastScan",
            url: "https://testnet.blastscan.io",
        },
    },
    contracts: {},
    testnet: true,
};

export const App = ({ children }: { children: any; }) => {
    const dispatch = useDispatch();
    const { chain } = useNetwork();
    const { address, isConnected } = useAccount();
    const [authChecked, setAuthChecked] = useState<boolean>(false);
    const authAddress = useSelector((state: RootState) => state.player.authAddress);

    const chainToUse = true ? polygonMumbai : polygon;
    const isWrongChain = !!chain && chain.id !== chainToUse.id;

    const checkAuthentication = async () => {
        setAuthChecked(false);

        if (!address) {
            dispatch(setAuthAddress({ authAddress: undefined }));
            return;
        }

        // fetch the logged user and the user associated to the connected address
        // we will compare the two and trigger different actions depending on them
        const loggedUser = await getLoggedUser();
        if (loggedUser && loggedUser.address === address) {
            // address belongs to the logged user, all good
            dispatch(setAuthAddress({ authAddress: loggedUser.address }));
        } else {
            // address does not belongs to the logged user
            // we will need to show the auth screen
            dispatch(setAuthAddress({ authAddress: undefined }));
        }

        setAuthChecked(true);
    };

    useEffect(() => {
        checkAuthentication();
    }, [address]);

    return (
        <>
            {/* Header */}
            <div className="header">
                <img src={logo} alt="DaoVsDao logo" className="header__page-logo" />
                <div className="header__wallet-control">
                    <ReferralLink />
                    <Web3Button />
                </div>
            </div>

            {/* Page */}
            <div className="page">
                {!address || !isConnected
                    ? <DisconnectedPage />
                    : !authChecked
                        ? null
                        : !authAddress
                            ? <UnauthenticatedPage />
                            : isWrongChain
                                ? <WrongChainPage chainToUse={chainToUse} />
                                : children
                }
            </div>
            <Toaster position="top-right" />
        </>
    );
};
