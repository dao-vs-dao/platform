import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type MessagingState = {
    isModalOpen: boolean;
};

const initialState: MessagingState = {
    isModalOpen: false
};

export const messagingSlice = createSlice({
    name: "messaging",
    initialState,
    reducers: {
        openMessagingModal: (state, action: PayloadAction<{}>) => {
            state.isModalOpen = true;
        },
        closeMessagingModal: (state, action: PayloadAction<{}>) => {
            state.isModalOpen = false;
        }
    }
});

export const { openMessagingModal, closeMessagingModal } = messagingSlice.actions;
export default messagingSlice.reducer;
