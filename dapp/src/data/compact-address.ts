export const compactAddress = (address: string): string => `${address.substring(37)}`;

export const shortenAddress = (address: string): string =>
    `${address.substring(0, 5)}...${address.substring(37)}`;
