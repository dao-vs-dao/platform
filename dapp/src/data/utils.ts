/** The ethereum address representing address(0) */
export const zeroAddress = "0x0000000000000000000000000000000000000000";

/** Round the number at the fifth decimal place */
export const roundAtFifthDecimal = (n: number) => Math.round(n * 100000) / 100000;
