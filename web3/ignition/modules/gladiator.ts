import { ethers } from "hardhat";

async function main() {
    // Get the signer (deployer) account
    const [deployer] = await ethers.getSigners();

    console.log("Deploying Gladiator contract...");
    console.log("Deployer address:", deployer.address);

    // Deploy the Gladiator contract
    const Gladiator = await ethers.getContractFactory("Gladiator");
    const gladiator = await Gladiator.deploy();

    await gladiator.waitForDeployment();

    const contractAddress = await gladiator.getAddress();
    console.log("Gladiator contract deployed at:", contractAddress);

}

// Execute the deploy script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });
