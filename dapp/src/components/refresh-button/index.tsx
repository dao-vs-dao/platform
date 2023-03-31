import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useAccount, useProvider } from "wagmi";
import { RootState } from "../../state/store";

import { retrieveGameState } from "../shared";
import { promiseToast } from "../toaster";

export const RefreshButton = () => {
    const dispatch = useDispatch();
    const { address } = useAccount();
    const provider = useProvider();
    const isRefreshing = useSelector((state: RootState) => state.game.isRefreshing);

    const reload = async () => {
        if (isRefreshing) return;
        await promiseToast(
            retrieveGameState(dispatch, provider, address),
            "Updating game data...",
            undefined,
            "Something went wrong. Contact us if it keeps happening"
        );
    };

    return <button
        className={`ui-button ${isRefreshing ? "ui-button--disabled" : ""}`}
        onClick={reload}>
        <div className="ui-button__icon ui-button__icon--refresh" />
    </button>;
};
