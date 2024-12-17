import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy DAFI Token
  const DAFIToken = await ethers.getContractFactory("DAFIToken");
  const dafiToken = await DAFIToken.deploy();
  await dafiToken.deployed();
  console.log("DAFIToken deployed to:", dafiToken.address);

  // Deploy CropToken
  const CropToken = await ethers.getContractFactory("CropToken");
  const cropToken = await CropToken.deploy();
  await cropToken.deployed();
  console.log("CropToken deployed to:", cropToken.address);

  // Deploy FarmAssetToken
  const FarmAssetToken = await ethers.getContractFactory("FarmAssetToken");
  const farmAssetToken = await FarmAssetToken.deploy();
  await farmAssetToken.deployed();
  console.log("FarmAssetToken deployed to:", farmAssetToken.address);

  // Deploy DAFIVault
  const DAFIVault = await ethers.getContractFactory("DAFIVault");
  const dafiVault = await DAFIVault.deploy(dafiToken.address);
  await dafiVault.deployed();
  console.log("DAFIVault deployed to:", dafiVault.address);

  // Deploy DAFILending
  const DAFILending = await ethers.getContractFactory("DAFILending");
  const dafiLending = await DAFILending.deploy(dafiToken.address);
  await dafiLending.deployed();
  console.log("DAFILending deployed to:", dafiLending.address);

  // Deploy DAFIMarketplace
  const DAFIMarketplace = await ethers.getContractFactory("DAFIMarketplace");
  const dafiMarketplace = await DAFIMarketplace.deploy(dafiToken.address, farmAssetToken.address);
  await dafiMarketplace.deployed();
  console.log("DAFIMarketplace deployed to:", dafiMarketplace.address);

  // Deploy WeatherDerivatives
  const WeatherDerivatives = await ethers.getContractFactory("WeatherDerivatives");
  const weatherDerivatives = await WeatherDerivatives.deploy(dafiToken.address);
  await weatherDerivatives.deployed();
  console.log("WeatherDerivatives deployed to:", weatherDerivatives.address);

  // Save deployment addresses
  const deploymentInfo = {
    DAFIToken: dafiToken.address,
    CropToken: cropToken.address,
    FarmAssetToken: farmAssetToken.address,
    DAFIVault: dafiVault.address,
    DAFILending: dafiLending.address,
    DAFIMarketplace: dafiMarketplace.address,
    WeatherDerivatives: weatherDerivatives.address,
  };

  console.log("\nDeployment Info:", deploymentInfo);
  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
