export const blastSepolia = {
    id: 168587773,
    name: "Blast Sepolia",
    network: "blast_sepolia",
    nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ["https://sepolia.blast.io"],
        },
        public: {
            http: ["https://sepolia.blast.io"],
        },
    },
    blockExplorers: {
        etherscan: {
            name: "BlastScan",
            url: "https://testnet.blastscan.io/",
        },
        default: {
            name: "BlastScan",
            url: "https://testnet.blastscan.io",
        },
    },
    contracts: {},
    testnet: true,
};
