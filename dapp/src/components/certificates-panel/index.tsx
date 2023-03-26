import React, { MutableRefObject, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ISponsorshipCertificate } from "../../@types/i-sponsoring";

import { closeSponsoringModal, openSponsoringModal } from "../../state/slices/sponsoring-slice";
import { RootState } from "../../state/store";
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
    const isModalOpen = useSelector((state: RootState) => state.sponsoring.isModalOpen);
    const owned = useSelector((state: RootState) => state.sponsoring.ownedCertificates);
    const beneficiary = useSelector((state: RootState) => state.sponsoring.beneficiaryCertificates);
    const open = owned.filter(cert => !cert.closed);
    const closed = owned.filter(cert => cert.closed);
    const ref: MutableRefObject<any> = useRef(null);

    const sum = (n: number[]) => n.reduce((prev, curr) => curr + prev, 0);
    const calculateCost = (certs: ISponsorshipCertificate[]) => sum(certs.map(c => c.amount));
    const calculateRedeemed = (certs: ISponsorshipCertificate[]) => sum(certs.map(c => c.redeemed));
    const closePanel = () => dispatch(closeSponsoringModal({}));

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
                        {open.map(cert => <SponsorshipCertificate key={cert.id} cert={cert} />)}
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
                        <div>Net profits: {calculateRedeemed(closed) - calculateCost(closed)} DVD</div>
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
