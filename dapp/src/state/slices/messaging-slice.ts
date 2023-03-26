import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { IMessage } from "../../@types/i-message";

type Chat = { [address: string]: IMessage[] };
export type MessagingState = {
    isModalOpen: boolean;
    unread: number;
    selectedChat?: string;
    chat: Chat;
};

const initialState: MessagingState = {
    isModalOpen: false,
    unread: 0,
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
            let unreadFromBatch = 0;
            for (const message of action.payload.messages) {
                const other = message.from !== action.payload.player ? message.from : message.to;

                if (message.from === other && !message.read) unreadFromBatch++;
                if (!state.chat[other]) state.chat[other] = [];
                state.chat[other].push(message);
            }
            state.unread += unreadFromBatch;
        },
        setThreadAsRead: (state, action: PayloadAction<{ thread: string }>) => {
            const thread = action.payload.thread;
            const messages = state.chat[thread] ?? [];
            let readMessages = 0;
            for (var i = 0; i < messages.length; i++) {
                if (messages[i].from === thread && !messages[i].read) {
                    messages[i].read = true;
                    readMessages++;
                }
            }

            state.chat[thread] = messages;
            state.unread -= readMessages;
        },
        deleteMessages: (state, action: PayloadAction<{}>) => {
            state.chat = {};
        },
    }
});

export const { openMessagingModal, closeMessagingModal, pushMessages, setThreadAsRead, deleteMessages } =
    messagingSlice.actions;
export default messagingSlice.reducer;
