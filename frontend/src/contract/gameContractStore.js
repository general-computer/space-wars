import { ethers } from "ethers";
import gameABI from "./gameABI";

const gameContractStore = (function () {
  // !!! This contract address may change
  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  // The extracted contract object
  let _contract;

  async function init() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // !!! signer.getAddress will throw if no address is connected in the wallet
    // Such signer cannot sign transactions
    let signerAddr = null;
    try {
      signerAddr = await signer.getAddress();
      console.log(signerAddr);
    } catch {
      console.warn("gameContractStore.init: no wallet address connected");
    }

    try {
      _contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        gameABI,
        signerAddr === null ? provider : signer
      );
      await _contract.deployed();
    } catch {
      throw new Error(
        "gameContractStore: the game contract has not yet been deployed",
        {
          cause: "GAME-CONTRACT-NOT-DEPLOYED",
        }
      );
    }

    return _contract;
  }

  function getContract() {
    return _contract;
  }

  return {
    init,
    getContract,
  };
})();

export default gameContractStore;
