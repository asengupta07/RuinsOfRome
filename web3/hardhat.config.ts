import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";

const { RPC_URL_FUJI, PRIVATE_KEY, FUJI_API_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    fuji: {
      url: `${RPC_URL_FUJI}`,
      accounts: [`${PRIVATE_KEY}`],
      chainId: 43113,
    },
  },
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: `${FUJI_API_KEY}`,
    },
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
