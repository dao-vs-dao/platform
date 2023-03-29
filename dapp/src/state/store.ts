import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./slices/game-slice";
import playerReducer from "./slices/player-slice";
import sponsoringReducer from "./slices/sponsoring-slice";
import messagingSlice from "./slices/messaging-slice";
import feedSlice from "./slices/feed-slice";

export const store = configureStore({
    reducer: {
        game: gameReducer,
        player: playerReducer,
        sponsoring: sponsoringReducer,
        messaging: messagingSlice,
        newsFeed: feedSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
