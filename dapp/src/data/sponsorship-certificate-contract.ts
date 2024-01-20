import { Contract, ethers, providers, Signer } from "ethers";
import { BNToPOJOCertificate, ISponsorshipCertificate } from "../@types/i-sponsoring";
import { SponsorshipCertificateABI } from "./abis/sponsorship-certificate";

const POLYGON_SC_ADDRESS = "0x3EB16b38DfE7725e699e0A76Cf668a690ca0C34C";
const MUMBAI_SC_ADDRESS = "0x54e2B241a3f9Fc47Bb7408Aa348a76bF96956508";
const getContractAddress = () => (true ? MUMBAI_SC_ADDRESS : POLYGON_SC_ADDRESS);


/**
 * Fetch the Sponsorship Certificate contract
 */
export const getSCContract = async (provider: providers.Provider): Promise<Contract> =>
    new ethers.Contract(getContractAddress(), SponsorshipCertificateABI, provider);


/**
 * Fetch information about the specified player.
 * @dev it will return `undefined` if the address doesn't belong to a player.
 */
export const fetchPlayerCertificates = async (
    provider: providers.Provider,
    walletAddress: string
): Promise<{ owned: ISponsorshipCertificate[]; beneficiary: ISponsorshipCertificate[] }> => {
    try {
        const sc = new ethers.Contract(getContractAddress(), SponsorshipCertificateABI, provider);
        const { owned, beneficiary } = await sc.getUserCertificates(walletAddress);

        // convert certificates to POJO and add owner addresses
        const ownedCert = owned.map(BNToPOJOCertificate);
        const beneficiaryCert = beneficiary.map(BNToPOJOCertificate);

        return { owned: ownedCert, beneficiary: beneficiaryCert };
    } catch (error) {
        console.error(error);
        return { owned: [], beneficiary: [] };
    }
};

/**
 * Redeem the specified certificate
 */
export const redeemCertificate = async (
    signer: Signer,
    certificateId: number
): Promise<void> => {
    const sc = new ethers.Contract(getContractAddress(), SponsorshipCertificateABI, signer);
    const tx = await sc.redeemCertificate(certificateId);
    await tx.wait();
};
