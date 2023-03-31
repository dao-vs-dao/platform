import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAccount, useProvider, useSigner } from "wagmi";
import { ISponsorshipCertificate } from "../../@types/i-sponsoring";
import { shortenAddress } from "../../data/compact-address";
import { sponsor } from "../../data/dao-vs-dao-contract";
import { redeemCertificate } from "../../data/sponsorship-certificate-contract";
import { roundAtFifthDecimal } from "../../data/utils";

import { closeInitiationModal, closeSponsoringModal, toggleSponsoringModal } from "../../state/slices/sponsoring-slice";
import { RootState } from "../../state/store";
import { retrieveGameState } from "../shared";
import { errorToast, promiseToast } from "../toaster";
import { SponsorshipCertificate } from "./sponsorship-certificate";
import "./styles.css";

export const CertificatesPanel = () => {
    const isModalOpen = useSelector((state: RootState) => state.sponsoring.isModalOpen);
    const isInitModalOpen = useSelector((state: RootState) => state.sponsoring.isInitiationModalOpen);

    return <>
        <ClosedCertificatesPanel />
        {isModalOpen ? <OpenCertificatesPanel /> : null}
        {isInitModalOpen ? <OpenInitCertificatesPanel /> : null}
    </>;
};

const ClosedCertificatesPanel = () => {
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.sponsoring.isModalOpen);

    const openPanel = () => dispatch(toggleSponsoringModal());

    return <div
        className={`certificate-panel-bt ${isModalOpen ? "certificate-panel-bt--pressed" : ""}`}
        onClick={openPanel}>
        <div className="certificate-panel-bt__icon" />
    </div>;
};

const OpenCertificatesPanel = () => {
    const dispatch = useDispatch();
    const { address } = useAccount();
    const provider = useProvider();
    const { data: signer, isError: isSignerError } = useSigner();
    const isModalOpen = useSelector((state: RootState) => state.sponsoring.isModalOpen);
    const owned = useSelector((state: RootState) => state.sponsoring.ownedCertificates);
    const beneficiary = useSelector((state: RootState) => state.sponsoring.beneficiaryCertificates);
    const open = owned.filter(cert => !cert.closed);
    const closed = owned.filter(cert => cert.closed);
    const ref: MutableRefObject<any> = useRef(null);

    const sum = (n: number[]) => roundAtFifthDecimal(n.reduce((prev, curr) => curr + prev, 0));
    const calculateCost = (certs: ISponsorshipCertificate[]) => sum(certs.map(c => c.amount));
    const calculateRedeemed = (certs: ISponsorshipCertificate[]) => sum(certs.map(c => c.redeemed));
    const closePanel = () => dispatch(closeSponsoringModal());

    const redeemSponsorshipCertificate = async (certificateId: number) => {
        if (!address) {
            errorToast("We cannot get the address of your wallet");
            return;
        }
        if (!signer || isSignerError) {
            errorToast("We cannot get a signer from your wallet. Contact us if it keeps happening");
            return;
        }

        try {
            const promise = redeemCertificate(signer, certificateId).then(() => retrieveGameState(dispatch, provider, address));
            await promiseToast(
                promise,
                "Redeeming sponsorship certificate 💵",
                `Redeem successful!`,
                "Something strange happened. Contact us if the error persists"
            );;
        } catch (error) {
            // user is informed via an error toast when the promise fails
            console.log(error);
            return;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (isModalOpen && ref.current
                && !event.target?.className?.includes?.("certificate-panel")
                && !ref.current.contains(event.target)) {
                closePanel();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return <div className="certificate-panel" ref={ref}>
        <div className="certificate-panel__close" onClick={closePanel} />
        <div className="certificate-panel__title">Sponsorships</div>
        <div className="certificate-panel__description">
            Sponsoring other users allow you to earn additional DVD each time they attack
            other players, but you will also loose part of your sponsorship if they are attacked
        </div>

        {/* Owned Certificates */}
        <div className="certificate-panel__section">
            <div className="certificate-panel__section-title">Open Sponsorships</div>
            {open.length > 0
                ?
                <>
                    <div className="certificate-panel__list">

                        {open.map(cert =>
                            <div key={cert.id} className="certificate-panel__redeemable-cert">
                                <SponsorshipCertificate key={cert.id} cert={cert} />
                                <div className="certificate-panel__redeem-button"
                                    onClick={() => redeemSponsorshipCertificate(cert.id)}>
                                    Redeem
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="certificate-panel__stats">
                        <div>Invested: {calculateCost(open)} DVD</div>
                        <div>Redeemable now: {calculateRedeemed(open)} DVD</div>
                    </div>
                </>
                : <div className="certificate-panel__list-msg">You are not sponsoring anyone</div>
            }
        </div>

        {/* Ended Certificates */}
        <div className="certificate-panel__section">
            <div className="certificate-panel__section-title">Redeemed Sponsorships</div>
            {closed.length > 0
                ?
                <>
                    <div className="certificate-panel__list">
                        {closed.map(cert => <SponsorshipCertificate key={cert.id} cert={cert} />)}
                    </div>
                    <div className="certificate-panel__stats">
                        <div>Net profits: {roundAtFifthDecimal(calculateRedeemed(closed) - calculateCost(closed))} DVD</div>
                    </div>
                </>
                : <div className="certificate-panel__list-msg">You didn't redeem any sponsorship</div>
            }
        </div>

        {/* Beneficiary Certificates */}
        <div className="certificate-panel__section">
            <div className="certificate-panel__section-title">Sponsorships On You</div>
            {beneficiary.length > 0
                ?
                <>
                    <div className="certificate-panel__list">
                        {beneficiary.map(cert => <SponsorshipCertificate key={cert.id} cert={cert} />)}
                    </div>
                    <div className="certificate-panel__stats">
                        <div>Invested: {calculateCost(beneficiary)} DVD</div>
                    </div>
                </>
                : <div className="certificate-panel__list-msg">No one is sponsoring you</div>
            }
        </div>
    </div>;
};


const OpenInitCertificatesPanel = () => {
    const dispatch = useDispatch();
    const { address } = useAccount();
    const provider = useProvider();
    const { data: signer, isError: isSignerError } = useSigner();
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);
    const isModalOpen = useSelector((state: RootState) => state.sponsoring.isInitiationModalOpen);
    const sponsoringAddress = useSelector((state: RootState) => state.sponsoring.sponsoringAddress);

    const userBalance = currentPlayer?.balance ?? 0;
    const [amount, setAmount] = useState<number>(Math.min(0.001, userBalance));
    const ref: MutableRefObject<any> = useRef(null);

    const closePanel = () => dispatch(closeInitiationModal());
    const triggerSponsoring = async () => {
        if (!address) {
            errorToast("We cannot get the address of your wallet");
            return;
        }
        if (!sponsoringAddress) {
            errorToast("We cannot get the address of user you want to sponsor");
            return;
        }
        if (!signer || isSignerError) {
            errorToast("We cannot get a signer from your wallet. Contact us if it keeps happening");
            return;
        }

        try {
            const promise = sponsor(signer, sponsoringAddress, amount)
                .then(() => retrieveGameState(dispatch, provider, address));
            await promiseToast(
                promise,
                "Creating sponsorship contract...",
                "Sponsoring successful!",
                "Something strange happened. Contact us if the error persists"
            );;
        } catch (error) {
            // user is informed via an error toast when the promise fails
            console.log(error);
            return;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (isModalOpen && ref.current
                && !event.target?.className?.includes?.("cell-stats__button")
                && !ref.current.contains(event.target)) {
                closePanel();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (!currentPlayer) return null;
    if (!sponsoringAddress) return null;

    return <div className="certificate-panel" ref={ref}>
        <div className="certificate-panel__close" onClick={closePanel} />
        <div className="certificate-panel__title">Add New Sponsorship</div>
        <div className="certificate-panel__description">
            Sponsoring other users allow you to earn additional DVD each time they attack
            other players, but you will also loose part of your sponsorship if they are attacked
        </div>

        <div className="certificate-panel__sponsoring-text">
            Sponsoring: {shortenAddress(sponsoringAddress)}
        </div>

        <div className="certificate-panel__form">
            <div className="certificate-panel__input-container">
                <input className="certificate-panel__input-amount"
                    type="number"
                    value={amount}
                    max={currentPlayer.balance}
                    min={0.0001}
                    onChange={(e) => {
                        var amount = Number(e.target.value);
                        if (amount < 0.001) amount = 0.001;
                        if (amount > currentPlayer.balance) amount = currentPlayer.balance;
                        setAmount(amount);
                    }
                    }
                />
            </div>

            <button onClick={triggerSponsoring} className="certificate-panel__sponsor-bt">Sponsor</button>
        </div>

    </div>;
};
