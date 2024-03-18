import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    baobap: {
        url: "https://api.baobab.klaytn.net:8651",
        chainId: 1001,
        accounts: {
            mnemonic: "alcohol million debate often spare merit acid motor around ranch indicate summer",
        },
    },
},
};

export default config;
