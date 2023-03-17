import React from "react";
import { useDispatch } from "react-redux";
import { useAccount, useSigner } from "wagmi";

import { getLoggedUser, getMessageToSign, login } from "../../services/authentication";
import { setAuthAddress } from "../../state/slices/player-slice";
import { errorToast } from "../../components/toaster";
import "./styles.css";

export const UnauthenticatedPage = () => {
    const dispatch = useDispatch();
    const { address } = useAccount();
    const { data: signer, isError: isSignerError } = useSigner()

    const triggerLogin = async () => {
        if (!address) {
            errorToast("Cannot sign up, address is missing!");
            return;
        }
        if (!signer || isSignerError) {
            errorToast("We cannot get a signer from your wallet. Contact us if it keeps happening");
            return;
        }

        const message = await getMessageToSign(address!);
        const signedMessage = await signer.signMessage(message);
        await login(signedMessage, address!);

        const user = await getLoggedUser();
        if (!user) {
            errorToast("Something went wrong during the authentication");
            return;
        }

        dispatch(setAuthAddress({ authAddress: user.address }));
    };

    return (
        <div className="disconnected-page">
            <div className="disconnected-page__title">Now you must authenticate</div>
            <br /><br />
            <button onClick={triggerLogin}>Authenticate</button>
        </div>
    );
};
