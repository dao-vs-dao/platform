import { AnyAction } from "@reduxjs/toolkit";
import { providers } from "ethers";
import { Dispatch } from "react";
import { fetchGameData, fetchPlayerData } from "../data/dao-vs-dao-contract";
import { fetchPlayerCertificates } from "../data/sponsorship-certificate-contract";
import { setGameData } from "../state/slices/game-slice";
import { setCurrentPlayer } from "../state/slices/player-slice";
import { setPlayerCertificates } from "../state/slices/sponsoring-slice";

/**
 * Retrieve the game stats and saves them in the global state
 */
export const retrieveGameState = async (
    dispatch: Dispatch<AnyAction>,
    provider: providers.Provider,
    address?: string
) => {
    const gameData = await fetchGameData(provider);
    dispatch(setGameData({ gameData }));
    console.debug(gameData);

    const currentPlayer = address ? await fetchPlayerData(provider, address) : null;
    dispatch(setCurrentPlayer({ currentPlayer }));
    console.debug(currentPlayer);

    const { owned: ownedCertificates, beneficiary: beneficiaryCertificates } = address
        ? await fetchPlayerCertificates(provider, address)
        : { owned: [], beneficiary: [] };
    dispatch(setPlayerCertificates({ ownedCertificates, beneficiaryCertificates }));
    console.debug({ ownedCertificates, beneficiaryCertificates });
};
