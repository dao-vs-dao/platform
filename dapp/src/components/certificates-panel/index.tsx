import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ISponsorshipCertificate } from "../../@types/i-sponsoring";
import { shortenAddress } from "../../data/compact-address";

import { closeSponsoringModal, openSponsoringModal } from "../../state/slices/sponsoring-slice";
import { RootState } from "../../state/store";
import { Tooltip, TooltipSize } from "../tooltip";
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
    const owned = useSelector((state: RootState) => state.sponsoring.ownedCertificates);
    const beneficiary = useSelector((state: RootState) => state.sponsoring.beneficiaryCertificates);
    const open = owned.filter(cert => !cert.closed);
    const closed = owned.filter(cert => cert.closed);

    const sum = (n: number[]) => n.reduce((prev, curr) => curr + prev, 0);
    const calculateCost = (certs: ISponsorshipCertificate[]) => sum(certs.map(c => c.amount));
    const calculateRedeemed = (certs: ISponsorshipCertificate[]) => sum(certs.map(c => c.redeemed));
    const closePanel = () => dispatch(closeSponsoringModal({}));

    return <div className="certificate-panel">
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
                        <div>Invested: {calculateCost(closed)} DVD</div>
                        <div>Redeemable now: {calculateRedeemed(closed)} DVD</div>
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
                ? <div className="certificate-panel__list">
                    {beneficiary.map(cert => <SponsorshipCertificate key={cert.id} cert={cert} />)}
                </div>
                : <div className="certificate-panel__list-msg">No one is sponsoring you</div>
            }
        </div>
    </div>;
};

const SponsorshipCertificate = ({ cert }: { cert: ISponsorshipCertificate; }) => {
    const certificate = <div className="certificate">
        <div className="certificate__image"><SponsorshipImage /></div>
        <div className="certificate__info">
            <div className="certificate__id">#{cert.id}</div>
        </div>
    </div>;

    const certificateInfo = <div className="certificate-info">
        <div className="certificate-info__row">
            <div className="certificate-info__row-value certificate-info__row-value--bold">
                Certificate #{cert.id}
            </div>
        </div>
        <div className="certificate-info__row">
            <div className="certificate-info__row-text">Owner</div>
            <div className="certificate-info__row-value">{shortenAddress(cert.owner)}</div>
        </div>
        <div className="certificate-info__row">
            <div className="certificate-info__row-text">Beneficiary</div>
            <div className="certificate-info__row-value">{shortenAddress(cert.receiver)}</div>
        </div>
        <div className="certificate-info__row">
            <div className="certificate-info__row-text">Invested</div>
            <div className="certificate-info__row-value">{cert.amount} DVD</div>
        </div>
        <div className="certificate-info__row">
            <div className="certificate-info__row-text">{cert.closed ? "Redeemed" : "Redeemable now"}</div>
            <div className="certificate-info__row-value">{cert.redeemed} DVD</div>
        </div>
        {cert.closed ?
            <div className="certificate-info__row">
                <div className="certificate-info__row-value certificate-info__row-value--bold">
                    Closed
                </div>
            </div>
            :
            <div className="certificate-info__row">
                <div className="certificate-info__row-text">Shares</div>
                <div className="certificate-info__row-value">{cert.shares}</div>
            </div>
        }

    </div>;

    return <Tooltip iconComponent={certificate} size={TooltipSize.Small}>
        {certificateInfo}
    </Tooltip>;
};

const SponsorshipImage = () => <svg viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#000000" />
    <polygon points="50,10 90,80 10,80" stroke="#FFFFFF" stroke-width="1">
        <animate attributeName="fill" values="#FFD800; #FFC200; #FFAB00; #FF9700; #FF8200; #FF6E00; #FF5900; #FF6E00; #FF8200; #FF9700; #FFAB00; #FFC200; #FFD800;" dur="10s" repeatCount="indefinite" />
    </polygon>
    <polygon points="50,15 85,75 15,75" stroke="#FFFFFF" stroke-width="1">
        <animate attributeName="fill" values="#FFC200; #FFAB00; #FF9700; #FF8200; #FF6E00; #FF5900; #FF6E00; #FF8200; #FF9700; #FFAB00; #FFC200; #FFD800; #FFC200;" dur="10s" repeatCount="indefinite" />
    </polygon>
    <polygon points="50,20 80,70 20,70" stroke="#FFFFFF" stroke-width="1">
        <animate attributeName="fill" values="#FFAB00; #FF9700; #FF8200; #FF6E00; #FF5900; #FF6E00; #FF8200; #FF9700; #FFAB00; #FFC200; #FFD800; #FFC200; #FFAB00;" dur="10s" repeatCount="indefinite" />
    </polygon>
    <polygon points="50,25 75,65 25,65" stroke="#FFFFFF" stroke-width="1">
        <animate attributeName="fill" values="#FF9700; #FF8200; #FF6E00; #FF5900; #FF6E00; #FF8200; #FF9700; #FFAB00; #FFC200; #FFD800; #FFC200; #FFAB00; #FF9700;" dur="10s" repeatCount="indefinite" />
    </polygon>
    <polygon points="50,30 70,60 30,60" stroke="#FFFFFF" stroke-width="1">
        <animate attributeName="fill" values="#FF8200; #FF6E00; #FF5900; #FF6E00; #FF8200; #FF9700; #FFAB00; #FFC200; #FFD800; #FFC200; #FFAB00; #FF9700; #FF8200; " dur="10s" repeatCount="indefinite" />
    </polygon>
    <polygon points="50,35 65,55 35,55" stroke="#FFFFFF" stroke-width="1">
        <animate attributeName="fill" values="#FF6E00; #FF5900; #FF6E00; #FF8200; #FF9700; #FFAB00; #FFC200; #FFD800; #FFC200; #FFAB00; #FF9700; #FF8200; #FF6E00;" dur="10s" repeatCount="indefinite" />
    </polygon>
    <polygon points="50,40 60,50 40,50" stroke="#FFFFFF" stroke-width="1">
        <animate attributeName="fill" values="#FF5900; #FF6E00; #FF8200; #FF9700; #FFAB00; #FFC200; #FFD800; #FFC200; #FFAB00; #FF9700; #FF8200; #FF6E00; #FF5900;" dur="10s" repeatCount="indefinite" />
    </polygon>
</svg>;
