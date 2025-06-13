import { ethers } from "hardhat";

async function deployCelestial() {
  console.log("Deploying Celestial contract...");

  const Celestial = await ethers.getContractFactory("Celestial");
  const celestial = await Celestial.deploy();

  await celestial.waitForDeployment();

  const contractAddress = await celestial.getAddress();
  console.log("Celestial contract deployed at:", contractAddress);
}

async function deployGladiator() {
  console.log("Deploying Gladiator contract...");

  // Deploy the Gladiator contract
  const Gladiator = await ethers.getContractFactory("Gladiator");
  const gladiator = await Gladiator.deploy();

  await gladiator.waitForDeployment();

  const contractAddress = await gladiator.getAddress();
  console.log("Gladiator contract deployed at:", contractAddress);
}

async function main() {
  // Get the signer (deployer) account
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  await deployCelestial();
  await deployGladiator();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });
