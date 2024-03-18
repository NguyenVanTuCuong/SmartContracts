import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    baobap: {
        url: "https://api.baobab.klaytn.net:8651",
        chainId: 1001,
        accounts: {
            mnemonic: "cradle lounge fall undo sound ivory earn shy whisper clump craft alarm",
        },
    },
},
};

export default config;
