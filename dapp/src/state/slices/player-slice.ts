import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IPlayer } from "../../@types/i-player";

export type PlayerState = {
    currentPlayer?: IPlayer | null;
    selectedCoords?: string;
};

const initialState: PlayerState = {};

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setCurrentPlayer: (state, action: PayloadAction<{ currentPlayer: IPlayer | null }>) => {
            state.currentPlayer = action.payload.currentPlayer;
        },
        setSelectedCoords: (state, action: PayloadAction<{ coords?: string }>) => {
            state.selectedCoords = action.payload.coords;
        }
    }
});

export const { setCurrentPlayer, setSelectedCoords } = playerSlice.actions;
export default playerSlice.reducer;
