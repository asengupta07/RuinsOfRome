import { ethers } from "hardhat";

async function main() {
  // Get the signer (deployer) account
  const [deployer] = await ethers.getSigners();

  console.log("Deploying Celestial contract...");
  console.log("Deployer address:", deployer.address);

  // Deploy the Celestial contract
  const Celestial = await ethers.getContractFactory("Celestial");
  const celestial = await Celestial.deploy();

  await celestial.waitForDeployment();

  const contractAddress = await celestial.getAddress();
  console.log("Celestial contract deployed at:", contractAddress);
}

// Execute the deploy script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });
