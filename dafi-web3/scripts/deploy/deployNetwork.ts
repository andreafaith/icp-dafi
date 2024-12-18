import { ethers, network, run } from "hardhat";
import { contractConfig } from "./config";
import fs from "fs";
import path from "path";

async function main() {
    // Get network from Hardhat config (see hardhat.config.ts)
    console.log(`Deploying to network: ${network.name}`);

    // Compile contracts
    await run("compile");

    // Deploy contracts
    const contracts = await deployContracts();

    // Save contract addresses
    await saveContractAddresses(contracts);
}

async function deployContracts() {
    const contracts: { [key: string]: string } = {};

    for (const [name, config] of Object.entries(contractConfig)) {
        console.log(`Deploying ${name}...`);
        const factory = await ethers.getContractFactory(name);
        const contract = await factory.deploy(...(config.args || []));
        await contract.deployed();
        contracts[name] = contract.address;
        console.log(`${name} deployed to:`, contract.address);
    }

    return contracts;
}

async function saveContractAddresses(contracts: { [key: string]: string }) {
    const deploymentPath = path.resolve(__dirname, "../deployments");
    if (!fs.existsSync(deploymentPath)) {
        fs.mkdirSync(deploymentPath, { recursive: true });
    }

    const filePath = path.join(deploymentPath, `${network.name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(contracts, null, 2));
    console.log(`Contract addresses saved to: ${filePath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
