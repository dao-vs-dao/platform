import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ISponsorshipCertificate } from "../../@types/i-sponsoring";

export type SponsoringState = {
    isModalOpen: boolean;
    sponsoringAddress?: string;
    ownedCertificates: ISponsorshipCertificate[];
    beneficiaryCertificates: ISponsorshipCertificate[];
};

const initialState: SponsoringState = {
    isModalOpen: false,
    ownedCertificates: [],
    beneficiaryCertificates: []
};

export const sponsoringSlice = createSlice({
    name: "sponsoring",
    initialState,
    reducers: {
        openSponsoringModal: (state, action: PayloadAction<{}>) => {
            state.isModalOpen = true;
        },
        closeSponsoringModal: (state, action: PayloadAction<{}>) => {
            state.isModalOpen = false;
            state.sponsoringAddress = undefined;
        },
        setPlayerCertificates: (
            state,
            action: PayloadAction<{
                ownedCertificates: ISponsorshipCertificate[];
                beneficiaryCertificates: ISponsorshipCertificate[];
            }>
        ) => {
            state.ownedCertificates = action.payload.ownedCertificates;
            state.beneficiaryCertificates = action.payload.beneficiaryCertificates;
        }
    }
});

export const { openSponsoringModal, closeSponsoringModal, setPlayerCertificates } = sponsoringSlice.actions;
export default sponsoringSlice.reducer;
