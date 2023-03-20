import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./slices/game-slice";
import playerReducer from "./slices/player-slice";
import sponsoringReducer from "./slices/sponsoring-slice";

export const store = configureStore({
    reducer: {
        game: gameReducer,
        player: playerReducer,
        sponsoring: sponsoringReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
