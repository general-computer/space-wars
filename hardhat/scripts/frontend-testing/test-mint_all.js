/**
 * !!! The script works for minting all of them at once, but makes Hardhat Network frozen and cannot call getState afterwards.
 * This script deploys the contract and mint all NFTs
 */

const hre = require("hardhat");

const SAMPLE_OWNERS = [
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
];

function rand(maxNum) {
  return Math.floor(Math.random() * (maxNum + 1));
}

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("The deployer address is:", signer.address);

  const balance = await signer.getBalance();
  console.log("balance:", ethers.utils.formatEther(balance));

  const Spaceship = await hre.ethers.getContractFactory("$Spaceship");

  const spaceship = await Spaceship.deploy();
  await spaceship.deployed();
  console.log("Spaceship deployed to:", spaceship.address);

  // !! You can mint all 69 NFTs at once but that will take ages to compute. Use force start instead
  const NFTS_TO_MINT = 3;
  const mintAllNFTs = new Array(NFTS_TO_MINT).fill("").map(async () => {
    const tx = await spaceship.safeMint(SAMPLE_OWNERS[rand(2)]);
    await tx.wait(1);
  });

  await Promise.all(mintAllNFTs);

  console.log(`All ${NFTS_TO_MINT} NFTs minted`);

  // To confirm the number of ships minted
  const currentSupply = await spaceship.getCurrentSupply();
  console.log("No. of ships minted:", currentSupply.toNumber() - 1);

  return [Spaceship, spaceship];
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

module.exports = function () {
  this.hre = hre;
  this.main = main;
};
