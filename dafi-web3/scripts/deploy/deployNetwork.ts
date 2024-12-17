import { ethers, network } from "hardhat";
import { Contract } from "ethers";
import { networkConfig, contractConfig } from "./config";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts to ${network.name} with account:`, deployer.address);

  const deployedContracts: { [key: string]: string } = {};
  const deploymentInfo: any = {
    network: network.name,
    deployer: deployer.address,
    contracts: {},
  };

  // Deploy contracts in order
  for (const [contractName, config] of Object.entries(contractConfig)) {
    console.log(`\nDeploying ${contractName}...`);

    // Resolve contract arguments
    const args = config.args.map((arg: string) => {
      if (typeof arg === "string" && arg.startsWith("$")) {
        const dependencyName = arg.slice(1);
        if (!deployedContracts[dependencyName]) {
          throw new Error(`Dependency ${dependencyName} not found for ${contractName}`);
        }
        return deployedContracts[dependencyName];
      }
      return arg;
    });

    // Deploy contract
    const Contract = await ethers.getContractFactory(contractName);
    const contract = await Contract.deploy(...args);
    await contract.deployed();

    deployedContracts[contractName] = contract.address;
    deploymentInfo.contracts[contractName] = {
      address: contract.address,
      args: args,
    };

    console.log(`${contractName} deployed to:`, contract.address);

    // Verify contract if needed
    if (networkConfig[network.name].verifyContract) {
      console.log(`Verifying ${contractName}...`);
      try {
        await verifyContract(contract.address, args);
        console.log(`${contractName} verified successfully`);
      } catch (error) {
        console.error(`Error verifying ${contractName}:`, error);
      }
    }
  }

  // Save deployment info
  const deploymentPath = path.join(__dirname, "../../deployments");
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = path.join(deploymentPath, `${network.name}_${timestamp}.json`);
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment info saved to ${filename}`);

  return deploymentInfo;
}

async function verifyContract(address: string, args: any[]) {
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
  } catch (error) {
    console.error("Error verifying contract:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
