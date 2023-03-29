import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IGame } from "../../@types/i-game";
import { IPlayer } from "../../@types/i-player";
import { coordToString } from "../../@types/i-coords";

export type PlayersDict = { [key: string]: IPlayer };

export type GameState = {
    gameData: IGame | null;
    playersByAddress: PlayersDict;
    playersByCoords: PlayersDict;
};

const initialState: GameState = {
    gameData: null,
    playersByAddress: {},
    playersByCoords: {}
};

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setGameData: (state, action: PayloadAction<{ gameData: IGame }>) => {
            state.gameData = action.payload.gameData;

            const playersByAddress: PlayersDict = {};
            const playersByCoords: PlayersDict = {};
            action.payload.gameData.players.forEach((player) => {
                playersByAddress[player.userAddress] = player;
                playersByCoords[coordToString(player.coords)] = player;
            });
            state.playersByAddress = playersByAddress;
            state.playersByCoords = playersByCoords;

            console.log({playersByAddress, playersByCoords})
        }
    }
});

export const { setGameData } = gameSlice.actions;
export default gameSlice.reducer;
