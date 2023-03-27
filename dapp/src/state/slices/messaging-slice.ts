import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { IMessage } from "../../@types/i-message";

type Chat = { [address: string]: IMessage[] };
type UnreadChat = { [address: string]: number };
export type MessagingState = {
    isModalOpen: boolean;
    selectedChat?: string;
    chat: Chat;
    unread: UnreadChat;
};

const initialState: MessagingState = {
    isModalOpen: false,
    unread: {},
    chat: {}
};

export const messagingSlice = createSlice({
    name: "messaging",
    initialState,
    reducers: {
        openMessagingModal: (state, action: PayloadAction<{ otherPlayer?: string }>) => {
            state.isModalOpen = true;

            const other = action.payload.otherPlayer;
            if (other && !state.chat[other]) state.chat[other] = [];
            state.selectedChat = other;
        },
        closeMessagingModal: (state, action: PayloadAction<{}>) => {
            state.isModalOpen = false;
        },
        pushMessages: (state, action: PayloadAction<{ player: string; messages: IMessage[] }>) => {
            for (const message of action.payload.messages) {
                const other = message.from !== action.payload.player ? message.from : message.to;

                if (!state.chat[other]) state.chat[other] = [];
                if (message.from === other && !message.read)
                    state.unread[other] = (state.unread[other] ?? 0) + 1;
                state.chat[other].push(message);
            }
        },
        setThreadAsRead: (state, action: PayloadAction<{ thread: string }>) => {
            delete state.unread[action.payload.thread];
        },
        deleteMessages: (state, action: PayloadAction<{}>) => {
            state.chat = {};
            state.unread = {};
        }
    }
});

export const {
    openMessagingModal,
    closeMessagingModal,
    pushMessages,
    setThreadAsRead,
    deleteMessages
} = messagingSlice.actions;
export default messagingSlice.reducer;
