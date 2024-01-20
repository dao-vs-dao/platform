import React from "react";
import { faker } from "@faker-js/faker";

import "./styles.css";
import { SponsorshipImage } from "./sponsorship-image";

const randomNumber = () => Math.round(Math.random() * 10000);
export const CertificatesList = () => {
    return (
        <div className="certificates">
            <div className="certificate">
                <div className="certificate__image">
                    <SponsorshipImage id={faker.datatype.number({ min: 0, max: 99999 })} receiver={faker.finance.ethereumAddress()} />
                </div>
                <div className="certificate__info">
                    <div className="certificate__id">#{randomNumber()}</div>
                </div>
            </div>

            <div className="certificate">
                <div className="certificate__image">
                    <SponsorshipImage id={faker.datatype.number({ min: 0, max: 99999 })} receiver={faker.finance.ethereumAddress()} />
                </div>
                <div className="certificate__info">
                    <div className="certificate__id">#{randomNumber()}</div>
                </div>
            </div>

            <div className="certificate">
                <div className="certificate__image">
                    <SponsorshipImage id={faker.datatype.number({ min: 0, max: 99999 })} receiver={faker.finance.ethereumAddress()} />
                </div>
                <div className="certificate__info">
                    <div className="certificate__id">#{randomNumber()}</div>
                </div>
            </div>

            <div className="certificate">
                <div className="certificate__image">
                    <SponsorshipImage id={faker.datatype.number({ min: 0, max: 99999 })} receiver={faker.finance.ethereumAddress()} />
                </div>
                <div className="certificate__info">
                    <div className="certificate__id">#{randomNumber()}</div>
                </div>
            </div>

            <div className="certificate">
                <div className="certificate__image">
                    <SponsorshipImage id={faker.datatype.number({ min: 0, max: 99999 })} receiver={faker.finance.ethereumAddress()} />
                </div>
                <div className="certificate__info">
                    <div className="certificate__id">#{randomNumber()}</div>
                </div>
            </div>

            <div className="certificate">
                <div className="certificate__image">
                    <SponsorshipImage id={faker.datatype.number({ min: 0, max: 99999 })} receiver={faker.finance.ethereumAddress()} />
                </div>
                <div className="certificate__info">
                    <div className="certificate__id">#{randomNumber()}</div>
                </div>
            </div>
        </div>
    );
};
