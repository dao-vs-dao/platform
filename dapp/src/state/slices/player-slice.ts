import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IPlayer } from "../../@types/i-player";

export type PlayerState = {
    authAddress?: string;
    currentPlayer?: IPlayer | null;
    selectedCoords?: string;
};

const initialState: PlayerState = {};

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setAuthAddress: (state, action: PayloadAction<{ authAddress?: string }>) => {
            state.authAddress = action.payload.authAddress;
        },
        setCurrentPlayer: (state, action: PayloadAction<{ currentPlayer: IPlayer | null }>) => {
            state.currentPlayer = action.payload.currentPlayer;
        },
        setSelectedCoords: (state, action: PayloadAction<{ coords?: string }>) => {
            state.selectedCoords = action.payload.coords;
        }
    }
});

export const { setCurrentPlayer, setSelectedCoords, setAuthAddress } = playerSlice.actions;
export default playerSlice.reducer;
