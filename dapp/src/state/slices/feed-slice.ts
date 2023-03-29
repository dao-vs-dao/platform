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
        openFeedModal: (state, action: PayloadAction<{}>) => {
            state.isModalOpen = true;
        },
        closeFeedModal: (state, action: PayloadAction<{}>) => {
            state.isModalOpen = false;
        },
        pushNews: (state, action: PayloadAction<{ news: INews }>) => {
            state.feed.push(action.payload.news);
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

export const { openFeedModal, closeFeedModal, pushNews, setNewsAsRead } = feedSlice.actions;
export default feedSlice.reducer;
