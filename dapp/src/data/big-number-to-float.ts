import { BigNumber } from "ethers";

/**
 * Converts a big number to a float
 * @param amount The BigNumber to convert
 * @param outputDecimals The number of decimals desired in the output value
 * @param inputDecimals The number of decimals in the input value (default: 18)
 */
export const bigNumberToFloat = (
    amount: BigNumber,
    outputDecimals: number = 4,
    inputDecimals: number = 18
): number => {
    // used for integer division
    const firstDivisor = BigNumber.from(10).pow(inputDecimals - (outputDecimals + 1));

    // used for float division (so to maintain some fractional digits)
    // has 1 extra decimal, so we can round the last value
    const secondDivisor = BigNumber.from(10)
        .pow(outputDecimals + 1)
        .toNumber();

    // the float value
    const nr = amount.div(firstDivisor).toNumber() / secondDivisor;

    // now let's round the last decimal
    const rounded = Math.round(nr * Math.pow(10, outputDecimals));

    // bring back to the desired number of decimals and return
    return rounded / Math.pow(10, outputDecimals);
};
