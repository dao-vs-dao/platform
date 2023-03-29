import { Contract, ethers, providers, Signer } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { ICoords } from "../@types/i-coords";
import { IGame } from "../@types/i-game";
import { BNToPOJOPlayer, IPlayer } from "../@types/i-player";
import { DaoVsDaoAbi } from "./abis/dao-vs-dao";
import { bigNumberToFloat } from "./big-number-to-float";

const POLYGON_DVD_ADDRESS = "0xAcd88F72B980ed144c7C037F6807E39026CFFd15";
const MUMBAI_DVD_ADDRESS = "0xAcd88F72B980ed144c7C037F6807E39026CFFd15";
const getContractAddress = () => (true ? MUMBAI_DVD_ADDRESS : POLYGON_DVD_ADDRESS);

const zeroAddress = "0x0000000000000000000000000000000000000000";

/**
 * Fetch the DVD contract
 */
export const getDVDContract = async (provider: providers.Provider): Promise<Contract> =>
    new ethers.Contract(getContractAddress(), DaoVsDaoAbi, provider);

/**
 * Fetch the global state of the game
 */
export const fetchGameData = async (provider: providers.Provider): Promise<IGame> => {
    const daoVsDao = new ethers.Contract(getContractAddress(), DaoVsDaoAbi, provider);
    const gameData = await daoVsDao.getGameData();

    // return {
    //     lands: [
    //         [
    //             ["0xA7D0F2c1f5EdB0b3e6F26A8ba03D521b688E171E"],
    //             [
    //                 "0xF4CfD9df7f78D782610cE339E2FDF6E11072C36f",
    //                 "0xC35C79aE067576FcC474E51B18c4eE4Ab36C0274"
    //             ],
    //             [
    //                 "0x10A6Da2Dee4b0E67Cf1fd139AF3DF16677b229A1",
    //                 "0xEDf3d5557AE628Dc3b5034ABfb76De4533Cc780E",
    //                 "0xEefe5E53a24A9d9e92Daa2Ac057DBA38c05d7daE"
    //             ],
    //             [
    //                 "0x4EFf6050C03742C0eC10bdf483Bc1F2AB8479BD2",
    //                 "0x90F1Cb932dbF94385434c40D53Df3727F00e50B1",
    //                 "0xF7c9D5b613f5D82FAca5007D03a2ceD1CD6FCA95",
    //                 "0xbd3Efc24f9Bdf77fac4b3CECCd81Ff870c710Ff8"
    //             ],
    //             [
    //                 "0x2F3257d02aAB93E85cCEdd0D293E3Fe3FC75cCF1",
    //                 "0x8b8565B942eB14879d79dd8E49E37C2CB0B971Dc",
    //                 "0x8B3e36Ba8d4521e673b536c88CE337616547453c",
    //                 "0x7dE837cAff6A19898e507F644939939cB9341209",
    //                 "0xaf5F8028F6331D51572C8fd6a706bE73b6b03a46"
    //             ],
    //             [
    //                 "0xFa3C19D557885B65c5E67c5Bd1DEFD4F68be0699",
    //                 "0xE71C22b3AA66D48c562260978D78009E70BeEB1b",
    //                 "0x8029A82469bd6529521718A22bC334d275f77012",
    //                 "0xE739fe452281AD92b97CC9eD1038AdC53FE91562",
    //                 "0x7dA184935226c6ecF6c7c99f581DB346b04ed371",
    //                 "0x94d7dB3D10cEC1Ac716Dfcd3466f17D8a271820C"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ],
    //             [
    //                 "0xd11540668ce33f447555b940E4f563c16688c475",
    //                 "0x001235C47A25d1dDf429878073232ab58C957654",
    //                 "0xf92d07bf805da869A67b326886Cb387182A89e06",
    //                 "0x2BF02a5B075A1488fc476B7878d22fF3B7Dda56b",
    //                 "0xEA727c510E4a29F392Ef88Dd7102d340a885Ab9d",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x045CF6D5BFBB6732A81AF3957cB66368f1132884",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274",
    //                 "0x8aBadeDdd493Eaf2584e7859cD895B39D3713274"
    //             ]
    //         ]
    //     ],
    //     players: [
    //         {
    //             userAddress: "0xA7D0F2c1f5EdB0b3e6F26A8ba03D521b688E171E",
    //             coords: {
    //                 realm: 0,
    //                 row: 0,
    //                 column: 0
    //             },
    //             balance: 1.32506,
    //             sponsorships: 0,
    //             claimable: 0.3962,
    //             attackCoolDownEndTimestamp: 1679299644000,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xF4CfD9df7f78D782610cE339E2FDF6E11072C36f",
    //             coords: {
    //                 realm: 0,
    //                 row: 1,
    //                 column: 0
    //             },
    //             balance: 0.25491,
    //             sponsorships: 0,
    //             claimable: 0.00319,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xC35C79aE067576FcC474E51B18c4eE4Ab36C0274",
    //             coords: {
    //                 realm: 0,
    //                 row: 1,
    //                 column: 1
    //             },
    //             balance: 0.59887,
    //             sponsorships: 0.00257,
    //             claimable: 0.00319,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0x10A6Da2Dee4b0E67Cf1fd139AF3DF16677b229A1",
    //             coords: {
    //                 realm: 0,
    //                 row: 2,
    //                 column: 0
    //             },
    //             balance: 0.23239,
    //             sponsorships: 0.00362,
    //             claimable: 0.00164,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533Cc780E",
    //             coords: {
    //                 realm: 0,
    //                 row: 2,
    //                 column: 1
    //             },
    //             balance: 0.0669,
    //             sponsorships: 0.00064,
    //             claimable: 0.00164,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533C16155",
    //             coords: {
    //                 realm: 0,
    //                 row: 3,
    //                 column: 0
    //             },
    //             balance: 0.0519,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533C15415",
    //             coords: {
    //                 realm: 0,
    //                 row: 3,
    //                 column: 1
    //             },
    //             balance: 0.0119,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533C15034",
    //             coords: {
    //                 realm: 0,
    //                 row: 3,
    //                 column: 2
    //             },
    //             balance: 0.0165,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533C1f3d5",
    //             coords: {
    //                 realm: 0,
    //                 row: 3,
    //                 column: 3
    //             },
    //             balance: 0.0079,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533CDf399",
    //             coords: {
    //                 realm: 0,
    //                 row: 3,
    //                 column: 4
    //             },
    //             balance: 0.00251,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533CD4ABf",
    //             coords: {
    //                 realm: 0,
    //                 row: 2,
    //                 column: 2
    //             },
    //             balance: 0.01281,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533C787C",
    //             coords: {
    //                 realm: 0,
    //                 row: 4,
    //                 column: 0
    //             },
    //             balance: 0.0005,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533C7EDf",
    //             coords: {
    //                 realm: 0,
    //                 row: 4,
    //                 column: 1
    //             },
    //             balance: 0.0034,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533CCCD1",
    //             coords: {
    //                 realm: 0,
    //                 row: 4,
    //                 column: 2
    //             },
    //             balance: 0.0099,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4539846Cd",
    //             coords: {
    //                 realm: 0,
    //                 row: 4,
    //                 column: 3
    //             },
    //             balance: 0.00488,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533CC5aB",
    //             coords: {
    //                 realm: 0,
    //                 row: 4,
    //                 column: 4
    //             },
    //             balance: 0.0078,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533Cd465",
    //             coords: {
    //                 realm: 0,
    //                 row: 4,
    //                 column: 5
    //             },
    //             balance: 0.00849,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De45331561d",
    //             coords: {
    //                 realm: 0,
    //                 row: 5,
    //                 column: 0
    //             },
    //             balance: 0.00156,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De453315124",
    //             coords: {
    //                 realm: 0,
    //                 row: 5,
    //                 column: 1
    //             },
    //             balance: 0.00451,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De453315612",
    //             coords: {
    //                 realm: 0,
    //                 row: 5,
    //                 column: 2
    //             },
    //             balance: 0.00156,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533189cd",
    //             coords: {
    //                 realm: 0,
    //                 row: 5,
    //                 column: 3
    //             },
    //             balance: 0.00454,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533189Ad",
    //             coords: {
    //                 realm: 0,
    //                 row: 5,
    //                 column: 4
    //             },
    //             balance: 0.00122,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         },
    //         {
    //             userAddress: "0xEDf3d5557AE628Dc3b5034ABfb76De4533155dd",
    //             coords: {
    //                 realm: 0,
    //                 row: 5,
    //                 column: 5
    //             },
    //             balance: 0.00213,
    //             sponsorships: 0.00064,
    //             claimable: 0.00104,
    //             attackCoolDownEndTimestamp: 0,
    //             recoveryCoolDownEndTimestamp: 0
    //         }
    //     ]
    // };

    const game = { lands: gameData.lands, players: gameData.players.map(BNToPOJOPlayer) };
    console.log(game);
    return game;
};

/**
 * Fetch information about the specified player.
 * @dev it will return `undefined` if the address doesn't belong to a player.
 */
export const fetchPlayerData = async (
    provider: providers.Provider,
    walletAddress: string
): Promise<IPlayer | null> => {
    try {
        const daoVsDao = new ethers.Contract(getContractAddress(), DaoVsDaoAbi, provider);
        const player = await daoVsDao.getPlayerData(walletAddress);
        return BNToPOJOPlayer(player);
    } catch (error) {
        console.error(error);
        return null;
    }
};

/**
 * Claim the accrued tokens.
 * @dev Should be wrapped in trycatch and a promise toast.
 */
export const claimTokens = async (signer: Signer): Promise<void> => {
    const daoVsDao = new ethers.Contract(getContractAddress(), DaoVsDaoAbi, signer);
    const tx = await daoVsDao.claimTokens();
    await tx.wait();
};

/**
 * Adds the user to the game
 * @dev Should be wrapped in trycatch and a promise toast.
 * @param signer The signer that will be used to trigger the tx.
 * @param coords The point in which the user wants to start.
 * @param referrer The player that referred this user.
 */
export const placeUser = async (
    signer: Signer,
    coords: ICoords,
    referrer?: string
): Promise<void> => {
    referrer = referrer ?? zeroAddress;
    const daoVsDao = new ethers.Contract(getContractAddress(), DaoVsDaoAbi, signer);
    const participationFee = await daoVsDao.participationFee();

    const tx = await daoVsDao.placeUser(coords, referrer, { value: participationFee });
    await tx.wait();
};

/**
 * Retrieve the current participation fee
 */
export const fetchParticipationFee = async (provider: providers.Provider): Promise<number> => {
    const daoVsDao = new ethers.Contract(getContractAddress(), DaoVsDaoAbi, provider);
    const participationFee = await daoVsDao.participationFee();
    return bigNumberToFloat(participationFee);
};

/**
 * Move the player to the selected coordinates, swapping its content.
 * @param signer The signer that will be used to trigger the tx.
 * @param coords The point to swap to.
 */
export const swap = async (signer: Signer, coords: ICoords) => {
    const daoVsDao = new ethers.Contract(getContractAddress(), DaoVsDaoAbi, signer);
    const tx = await daoVsDao.swap(coords);
    await tx.wait();
};

/**
 * Trigger a sponsoring tx.
 * @param signer The signer that will be used to trigger the tx.
 * @param user The user the sponsoring will be directed to.
 * @param amount The sponsored amount.
 */
export const sponsor = async (signer: Signer, user: string, amount: number) => {
    const daoVsDao = new ethers.Contract(getContractAddress(), DaoVsDaoAbi, signer);
    const tx = await daoVsDao.sponsor(user, parseEther(amount.toString()));
    await tx.wait();
};
