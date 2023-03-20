import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type SponsoringState = {
    isModalOpen: boolean;
    sponsoringAddress?: string;
};

const initialState: SponsoringState = {
    isModalOpen: false
};

export const sponsoringSlice = createSlice({
    name: "sponsoring",
    initialState,
    reducers: {
        openSponsoringModal: (state, action: PayloadAction<{address: string}>) => {
            state.isModalOpen = true;
            state.sponsoringAddress = action.payload.address;
        },
        closeSponsoringModal: (state, action: PayloadAction<{}>) => {
            state.isModalOpen = false;
            state.sponsoringAddress = undefined;
        }
    }
});

export const { openSponsoringModal, closeSponsoringModal } = sponsoringSlice.actions;
export default sponsoringSlice.reducer;
