import { ethers } from "hardhat";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const {
  NEXT_PUBLIC_KYC_CANISTER_ID,
  NEXT_PUBLIC_ASSET_CANISTER_ID,
  NEXT_PUBLIC_INVESTMENT_CANISTER_ID
} = process.env;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Log canister IDs
  console.log("Using Canister IDs:");
  console.log("KYC Canister:", NEXT_PUBLIC_KYC_CANISTER_ID);
  console.log("Asset Canister:", NEXT_PUBLIC_ASSET_CANISTER_ID);
  console.log("Investment Canister:", NEXT_PUBLIC_INVESTMENT_CANISTER_ID);

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

  // Deploy DAFI Platform
  const DAFIPlatform = await ethers.getContractFactory("DAFIPlatform");
  const dafiPlatform = await DAFIPlatform.deploy(
    dafiToken.address,
    cropToken.address,
    farmAssetToken.address
  );
  await dafiPlatform.deployed();
  console.log("DAFIPlatform deployed to:", dafiPlatform.address);

  // Set up roles and permissions
  const MINTER_ROLE = await dafiToken.MINTER_ROLE();
  await dafiToken.grantRole(MINTER_ROLE, dafiPlatform.address);
  console.log("Granted MINTER_ROLE to DAFIPlatform for DAFIToken");

  const minterRole = await cropToken.MINTER_ROLE();
  await cropToken.grantRole(minterRole, dafiPlatform.address);
  console.log("Granted MINTER_ROLE to DAFIPlatform for CropToken");

  const farmMinterRole = await farmAssetToken.MINTER_ROLE();
  await farmAssetToken.grantRole(farmMinterRole, dafiPlatform.address);
  console.log("Granted MINTER_ROLE to DAFIPlatform for FarmAssetToken");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
