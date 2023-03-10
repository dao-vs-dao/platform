export const DaoVsDaoAbi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "attacker",
                type: "address"
            },
            {
                indexed: true,
                internalType: "address",
                name: "attacked",
                type: "address"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "subtractedFromAttackedBalance",
                type: "uint256"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "subtractedFromAttackedSponsorships",
                type: "uint256"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "slashingTaxes",
                type: "uint256"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "addedToAttackerBalance",
                type: "uint256"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "addedToAttackerSponsorships",
                type: "uint256"
            }
        ],
        name: "Slashed",
        type: "event"
    },

    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address"
            },
            {
                internalType: "address",
                name: "spender",
                type: "address"
            }
        ],
        name: "allowance",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "spender",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
            }
        ],
        name: "approve",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address"
            }
        ],
        name: "balanceOf",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "claimTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_user",
                type: "address"
            }
        ],
        name: "claimable",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [
            {
                internalType: "uint8",
                name: "",
                type: "uint8"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "spender",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "subtractedValue",
                type: "uint256"
            }
        ],
        name: "decreaseAllowance",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "getGameData",
        outputs: [
            {
                components: [
                    {
                        internalType: "address[][][]",
                        name: "lands",
                        type: "address[][][]"
                    },
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "userAddress",
                                type: "address"
                            },
                            {
                                components: [
                                    {
                                        internalType: "uint64",
                                        name: "realm",
                                        type: "uint64"
                                    },
                                    {
                                        internalType: "uint64",
                                        name: "row",
                                        type: "uint64"
                                    },
                                    {
                                        internalType: "uint64",
                                        name: "column",
                                        type: "uint64"
                                    }
                                ],
                                internalType: "struct Coordinates",
                                name: "coords",
                                type: "tuple"
                            },
                            {
                                internalType: "uint256",
                                name: "balance",
                                type: "uint256"
                            },
                            {
                                internalType: "uint256",
                                name: "sponsorships",
                                type: "uint256"
                            },
                            {
                                internalType: "uint256",
                                name: "claimable",
                                type: "uint256"
                            }
                        ],
                        internalType: "struct PlayerData[]",
                        name: "players",
                        type: "tuple[]"
                    }
                ],
                internalType: "struct GameData",
                name: "",
                type: "tuple"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint64",
                name: "_realm",
                type: "uint64"
            }
        ],
        name: "getLastRow",
        outputs: [
            {
                internalType: "address[]",
                name: "",
                type: "address[]"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_sender",
                type: "address"
            }
        ],
        name: "getNeighboringAddresses",
        outputs: [
            {
                internalType: "address[]",
                name: "",
                type: "address[]"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_player",
                type: "address"
            }
        ],
        name: "getPlayerData",
        outputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "userAddress",
                        type: "address"
                    },
                    {
                        components: [
                            {
                                internalType: "uint64",
                                name: "realm",
                                type: "uint64"
                            },
                            {
                                internalType: "uint64",
                                name: "row",
                                type: "uint64"
                            },
                            {
                                internalType: "uint64",
                                name: "column",
                                type: "uint64"
                            }
                        ],
                        internalType: "struct Coordinates",
                        name: "coords",
                        type: "tuple"
                    },
                    {
                        internalType: "uint256",
                        name: "balance",
                        type: "uint256"
                    },
                    {
                        internalType: "uint256",
                        name: "sponsorships",
                        type: "uint256"
                    },
                    {
                        internalType: "uint256",
                        name: "claimable",
                        type: "uint256"
                    }
                ],
                internalType: "struct PlayerData",
                name: "",
                type: "tuple"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "spender",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "addedValue",
                type: "uint256"
            }
        ],
        name: "increaseAllowance",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint64",
                        name: "realm",
                        type: "uint64"
                    },
                    {
                        internalType: "uint64",
                        name: "row",
                        type: "uint64"
                    },
                    {
                        internalType: "uint64",
                        name: "column",
                        type: "uint64"
                    }
                ],
                internalType: "struct Coordinates",
                name: "c1",
                type: "tuple"
            },
            {
                components: [
                    {
                        internalType: "uint64",
                        name: "realm",
                        type: "uint64"
                    },
                    {
                        internalType: "uint64",
                        name: "row",
                        type: "uint64"
                    },
                    {
                        internalType: "uint64",
                        name: "column",
                        type: "uint64"
                    }
                ],
                internalType: "struct Coordinates",
                name: "c2",
                type: "tuple"
            }
        ],
        name: "isNeighbor",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "pure",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        name: "lands",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        name: "latestClaim",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "name",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "nrPlayers",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint64",
                        name: "realm",
                        type: "uint64"
                    },
                    {
                        internalType: "uint64",
                        name: "row",
                        type: "uint64"
                    },
                    {
                        internalType: "uint64",
                        name: "column",
                        type: "uint64"
                    }
                ],
                internalType: "struct Coordinates",
                name: "_coord",
                type: "tuple"
            },
            {
                internalType: "bool",
                name: "_addRow",
                type: "bool"
            }
        ],
        name: "placeUser",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_sponsor",
                type: "address"
            },
            {
                internalType: "address",
                name: "_receiver",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "_shares",
                type: "uint256"
            }
        ],
        name: "redeemSponsorshipShares",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "slashingPercentage",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "slashingTax",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_user",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "_amount",
                type: "uint256"
            }
        ],
        name: "sponsor",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        name: "sponsorshipShares",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        name: "sponsorships",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_user",
                type: "address"
            }
        ],
        name: "sponsorshipsOf",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint64",
                        name: "realm",
                        type: "uint64"
                    },
                    {
                        internalType: "uint64",
                        name: "row",
                        type: "uint64"
                    },
                    {
                        internalType: "uint64",
                        name: "column",
                        type: "uint64"
                    }
                ],
                internalType: "struct Coordinates",
                name: "_coords",
                type: "tuple"
            }
        ],
        name: "swap",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
            }
        ],
        name: "transfer",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "from",
                type: "address"
            },
            {
                internalType: "address",
                name: "to",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
            }
        ],
        name: "transferFrom",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address"
            }
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        name: "userCoord",
        outputs: [
            {
                internalType: "uint64",
                name: "realm",
                type: "uint64"
            },
            {
                internalType: "uint64",
                name: "row",
                type: "uint64"
            },
            {
                internalType: "uint64",
                name: "column",
                type: "uint64"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_user",
                type: "address"
            }
        ],
        name: "worth",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];
