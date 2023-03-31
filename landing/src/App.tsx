import React from "react";

import logo from "./assets/logo.svg";
import "react-toastify/dist/ReactToastify.css";
import "./fonts.css";
import "./constants.css";
import "./app.css";
import "./shared.css";

export const App = ({ children }: { children: any; }) => {
    return (
        <>
            {/* Header */}
            <div className="header">
                <img src={logo} alt="DaoVsDao logo" className="header__page-logo" />
                <div className="header__wallet-control">
                    <a href="https://game.daovsdao.xyz" className="ui-button">Play Now</a>
                </div>
            </div>

            {/* Page */}
            <div className="page">
                {children}
            </div>
        </>
    );
};
