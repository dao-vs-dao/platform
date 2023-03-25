import { ethers, providers } from "ethers";
import { BNToPOJOCertificate, ISponsorshipCertificate } from "../@types/i-sponsoring";
import { SponsorshipCertificateABI } from "./abis/sponsorship-certificate";

const POLYGON_SC_ADDRESS = "0x3EB16b38DfE7725e699e0A76Cf668a690ca0C34C";
const MUMBAI_SC_ADDRESS = "0x3EB16b38DfE7725e699e0A76Cf668a690ca0C34C";
const getContractAddress = () => (true ? MUMBAI_SC_ADDRESS : POLYGON_SC_ADDRESS);

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
