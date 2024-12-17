export const networkConfig = {
  hardhat: {
    name: "Hardhat",
    verifyContract: false,
  },
  localhost: {
    name: "Localhost",
    verifyContract: false,
  },
  goerli: {
    name: "Goerli",
    verifyContract: true,
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY,
    },
  },
  mainnet: {
    name: "Mainnet",
    verifyContract: true,
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY,
    },
  },
  polygon: {
    name: "Polygon",
    verifyContract: true,
    etherscan: {
      apiKey: process.env.POLYGONSCAN_API_KEY,
    },
  },
};

export const contractConfig = {
  DAFIToken: {
    args: [],
  },
  CropToken: {
    args: [],
  },
  FarmAssetToken: {
    args: [],
  },
  DAFIVault: {
    args: ["$DAFIToken"], // Reference to DAFIToken address
  },
  DAFILending: {
    args: ["$DAFIToken"],
  },
  DAFIMarketplace: {
    args: ["$DAFIToken", "$FarmAssetToken"],
  },
  WeatherDerivatives: {
    args: ["$DAFIToken"],
  },
};
