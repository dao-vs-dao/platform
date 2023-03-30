import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { INews } from "../../@types/i-feed";

export type FeedState = {
    isModalOpen: boolean;
    feed: INews[];
    unread: number;
};

const initialState: FeedState = {
    isModalOpen: false,
    feed: [],
    unread: 0
};

export const feedSlice = createSlice({
    name: "feed",
    initialState,
    reducers: {
        openFeedModal: (state) => {
            state.isModalOpen = true;
        },
        closeFeedModal: (state) => {
            state.isModalOpen = false;
        },
        toggleFeedModal: (state) => {
            state.isModalOpen = !state.isModalOpen;
        },
        pushNews: (state, action: PayloadAction<{ news: INews }>) => {
            // insert the news keeping the array sorted by "block"
            const indexToInsert = state.feed.findIndex((news) => news.block > action.payload.news.block);
            if (indexToInsert === -1) {
                state.feed.push(action.payload.news);
            } else {
                state.feed.splice(indexToInsert, 0, action.payload.news);
            }

            if (action.payload.news.unread) state.unread++;
        },
        setNewsAsRead: (state, action: PayloadAction<{}>) => {
            const feedCopy = JSON.parse(JSON.stringify(state.feed));
            for(var i = 0; i < feedCopy.length; i++) feedCopy[i].unread = false;
            state.feed = feedCopy;

            state.unread = 0;
        },
    }
});

export const { openFeedModal, closeFeedModal, pushNews, setNewsAsRead, toggleFeedModal } = feedSlice.actions;
export default feedSlice.reducer;
