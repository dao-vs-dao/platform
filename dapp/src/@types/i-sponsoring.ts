import { bigNumberToFloat } from "../data/big-number-to-float";

export interface ISponsorshipCertificate {
    id: number;
    receiver: string;
    owner: string;
    amount: number;
    redeemed: number;
    shares: number;
    closed: boolean;
}

/** Given a BigNumber-represented certificate, it returns a POJO version of it */
export const BNToPOJOCertificate = (certificate: any) =>
    ({
        id: certificate.id.toNumber(),
        owner: certificate.owner,
        receiver: certificate.receiver,
        amount: bigNumberToFloat(certificate.amount, 5),
        redeemed: bigNumberToFloat(certificate.redeemed, 5),
        shares: bigNumberToFloat(certificate.shares, 5),
        closed: certificate.closed
    } as ISponsorshipCertificate);
