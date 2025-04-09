import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";

const { RPC_URL_FUJI, RPC_URL_EDUCHAIN, PRIVATE_KEY, FUJI_API_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    fuji: {
      url: `${RPC_URL_FUJI}`,
      accounts: [`${PRIVATE_KEY}`],
      chainId: 43113,
    },
    eduChain: {
      url: RPC_URL_EDUCHAIN,
      chainId: 656476,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: `${FUJI_API_KEY}`,
      'eduChain': 'empty'
    },
    customChains: [
      {
        network: "eduChain",
        chainId: 656476,
        urls: {
          apiURL: "https://edu-chain-testnet.blockscout.com/api",
          browserURL: "https://edu-chain-testnet.blockscout.com"
        }
      }
    ]
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
