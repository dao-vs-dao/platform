import React, { MutableRefObject, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAccount, useProvider, useSigner } from "wagmi";
import { ISponsorshipCertificate } from "../../@types/i-sponsoring";
import { redeemCertificate } from "../../data/sponsorship-certificate-contract";
import { roundAtFifthDecimal } from "../../data/utils";

import { closeSponsoringModal, openSponsoringModal } from "../../state/slices/sponsoring-slice";
import { RootState } from "../../state/store";
import { retrieveGameState } from "../shared";
import { errorToast, promiseToast } from "../toaster";
import { SponsorshipCertificate } from "./sponsorship-certificate";
import "./styles.css";

export const CertificatesPanel = () => {
    const isModalOpen = useSelector((state: RootState) => state.sponsoring.isModalOpen);
    return isModalOpen ? <OpenCertificatesPanel /> : <ClosedCertificatesPanel />;
};

const ClosedCertificatesPanel = () => {
    const dispatch = useDispatch();
    const owned = useSelector((state: RootState) => state.sponsoring.ownedCertificates);
    const beneficiary = useSelector((state: RootState) => state.sponsoring.beneficiaryCertificates);

    const openPanel = () => dispatch(openSponsoringModal({}));

    return <div className="certificate-panel-bt" onClick={openPanel}>
        <div className="certificate-panel-bt__title">Sponsorships:</div>

        <div className="certificate-panel-bt__row">
            Owned:
            <div className="certificate-panel-bt__nr certificate-panel-bt__nr--owned">{owned.length}</div>
        </div>
        <div className="certificate-panel-bt__row">
            Beneficiary:
            <div className="certificate-panel-bt__nr certificate-panel-bt__nr--beneficiary">{beneficiary.length}</div>
        </div>
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
    const closePanel = () => dispatch(closeSponsoringModal({}));

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
