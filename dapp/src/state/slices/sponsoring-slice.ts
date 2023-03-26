import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ISponsorshipCertificate } from "../../@types/i-sponsoring";

export type SponsoringState = {
    isModalOpen: boolean;
    sponsoringAddress?: string;
    ownedCertificates: ISponsorshipCertificate[];
    beneficiaryCertificates: ISponsorshipCertificate[];
    sponsoredPlayers: Set<string>;
    sponsoringPlayers: Set<string>;
};

const initialState: SponsoringState = {
    isModalOpen: false,
    ownedCertificates: [],
    beneficiaryCertificates: [],
    sponsoredPlayers: new Set<string>(),
    sponsoringPlayers: new Set<string>()
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
            state.sponsoredPlayers = new Set(
                action.payload.ownedCertificates.filter((c) => !c.closed).map((c) => c.receiver)
            );
            state.sponsoringPlayers = new Set(
                action.payload.beneficiaryCertificates.map((c) => c.owner)
            );
        }
    }
});

export const { openSponsoringModal, closeSponsoringModal, setPlayerCertificates } =
    sponsoringSlice.actions;
export default sponsoringSlice.reducer;
