import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ISponsorshipCertificate } from "../../@types/i-sponsoring";

export type SponsoringState = {
    isModalOpen: boolean;
    isInitiationModalOpen: boolean;
    sponsoringAddress?: string;
    ownedCertificates: ISponsorshipCertificate[];
    beneficiaryCertificates: ISponsorshipCertificate[];
    sponsoredPlayers: { [address: string]: boolean };
    sponsoringPlayers: { [address: string]: boolean };
};

const initialState: SponsoringState = {
    isModalOpen: false,
    isInitiationModalOpen: false,
    ownedCertificates: [],
    beneficiaryCertificates: [],
    sponsoredPlayers: {},
    sponsoringPlayers: {}
};

export const sponsoringSlice = createSlice({
    name: "sponsoring",
    initialState,
    reducers: {
        openSponsoringModal: (state) => {
            state.isModalOpen = true;
        },
        closeSponsoringModal: (state) => {
            state.isModalOpen = false;
        },
        toggleSponsoringModal: (state) => {
            state.isModalOpen = !state.isModalOpen;
        },
        openInitiationModal: (state, action: PayloadAction<{ otherPlayer: string }>) => {
            state.isInitiationModalOpen = true;
            state.sponsoringAddress = action.payload.otherPlayer;
        },
        closeInitiationModal: (state) => {
            state.isInitiationModalOpen = false;
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

            const sponsoredPlayers: { [address: string]: boolean } = {};
            action.payload.ownedCertificates
                .filter((c) => !c.closed)
                .forEach((c) => (sponsoredPlayers[c.receiver] = true));
            state.sponsoredPlayers = sponsoredPlayers;

            const sponsoringPlayers: { [address: string]: boolean } = {};
            action.payload.beneficiaryCertificates.forEach(
                (c) => (sponsoringPlayers[c.owner] = true)
            );
            state.sponsoringPlayers = sponsoringPlayers;
        }
    }
});

export const {
    openSponsoringModal,
    closeSponsoringModal,
    setPlayerCertificates,
    toggleSponsoringModal,
    openInitiationModal,
    closeInitiationModal
} = sponsoringSlice.actions;
export default sponsoringSlice.reducer;
