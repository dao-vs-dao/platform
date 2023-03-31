import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { setFocus } from "../../state/slices/game-slice";
import { RootState } from "../../state/store";

export const RefocusButton = () => {
    const dispatch = useDispatch();
    const isRefreshing = useSelector((state: RootState) => state.game.isRefreshing);
    const focus = useSelector((state: RootState) => state.game.focus);

    const refocus = async () => {
        if (isRefreshing) return;
        dispatch(setFocus({}));
    };

    if (!focus) return null;

    return <button
        className={`ui-button ${isRefreshing ? "ui-button--disabled" : ""}`}
        onClick={refocus}>
        <div className="ui-button__icon ui-button__icon--focus" />
    </button>;
};
