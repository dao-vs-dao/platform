import React, { MutableRefObject, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { closeMessagingModal, openMessagingModal } from "../../state/slices/messaging-slice";
import { RootState } from "../../state/store";
import "./styles.css";

export const MessagesPanel = () => {
    const isModalOpen = useSelector((state: RootState) => state.messaging.isModalOpen);
    return isModalOpen ? <OpenMessagesPanel /> : <ClosedMessagesPanel />;
};

const ClosedMessagesPanel = () => {
    const dispatch = useDispatch();

    const openPanel = () => dispatch(openMessagingModal({}));

    return <div className="messages-panel-bt" onClick={openPanel}>
        <div className="messages-panel-bt__title">Messages:</div>

        <div className="messages-panel-bt__row">
            Unread:
            <div className="messages-panel-bt__nr">{0}</div>
        </div>
    </div>;
};

const OpenMessagesPanel = () => {
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.messaging.isModalOpen);
    const ref: MutableRefObject<any> = useRef(null);

    const closePanel = () => dispatch(closeMessagingModal({}));

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (isModalOpen && ref.current
                && !event.target?.className?.includes?.("messages-panel")
                && !ref.current.contains(event.target)) {
                closePanel();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return <div className="messages-panel" ref={ref}>
        <div className="messages-panel__close" onClick={closePanel} />
        <div className="messages-panel__title">Messages</div>
        <div className="messages-panel__description">
            You can only message your direct neighbors and messages will be pruned after
            24 hours.
        </div>

        {/* Owned Certificates */}
        {/* <div className="messages-panel__section">
            <div className="messages-panel__section-title">Open Sponsorships</div>
            {open.length > 0
                ?
                <>
                    <div className="messages-panel__list">

                        {open.map(cert =>
                            <div key={cert.id} className="messages-panel__redeemable-cert">
                                <SponsorshipCertificate key={cert.id} cert={cert} />
                                <div className="messages-panel__redeem-button"
                                    onClick={() => redeemSponsorshipCertificate(cert.id)}>
                                    Redeem
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="messages-panel__stats">
                        <div>Invested: {calculateCost(open)} DVD</div>
                        <div>Redeemable now: {calculateRedeemed(open)} DVD</div>
                    </div>
                </>
                : <div className="messages-panel__list-msg">You are not sponsoring anyone</div>
            }
        </div>*/}

        {/* Ended Certificates */}
        {/* <div className="messages-panel__section">
            <div className="messages-panel__section-title">Redeemed Sponsorships</div>
            {closed.length > 0
                ?
                <>
                    <div className="messages-panel__list">
                        {closed.map(cert => <SponsorshipCertificate key={cert.id} cert={cert} />)}
                    </div>
                    <div className="messages-panel__stats">
                        <div>Net profits: {roundAtFifthDecimal(calculateRedeemed(closed) - calculateCost(closed))} DVD</div>
                    </div>
                </>
                : <div className="messages-panel__list-msg">You didn't redeem any sponsorship</div>
            }
        </div> */}

        {/* Beneficiary Certificates */}
        {/* <div className="messages-panel__section">
            <div className="messages-panel__section-title">Sponsorships On You</div>
            {beneficiary.length > 0
                ?
                <>
                    <div className="messages-panel__list">
                        {beneficiary.map(cert => <SponsorshipCertificate key={cert.id} cert={cert} />)}
                    </div>
                    <div className="messages-panel__stats">
                        <div>Invested: {calculateCost(beneficiary)} DVD</div>
                    </div>
                </>
                : <div className="messages-panel__list-msg">No one is sponsoring you</div>
            }
        </div> */}
    </div>;
};
