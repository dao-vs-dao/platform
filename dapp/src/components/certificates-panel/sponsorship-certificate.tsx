import React from "react";
import { ISponsorshipCertificate } from "../../@types/i-sponsoring";
import { shortenAddress } from "../../data/compact-address";

import { Tooltip, TooltipSize } from "../tooltip";
import { SponsorshipImage } from "./sponsorship-image";
import "./styles.css";

export const SponsorshipCertificate = ({ cert }: { cert: ISponsorshipCertificate; }) => {
    const certificate = <div className="certificate">
        <div className="certificate__image"><SponsorshipImage cert={cert} /></div>
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
