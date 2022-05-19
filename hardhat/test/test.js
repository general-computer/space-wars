const hre = require('hardhat');
const { ethers } = hre;
const { use, expect } = require('chai');
const { solidity } = require("ethereum-waffle");


use(solidity)

describe("Spaceship contract", function() {
  let contract;

  // increase timeout for congested networks
  this.timeout(120000);

  if (process.env.CONTRACT_ADDRESS) {
    it("Should connect to external contract", async function () {
      contract = await ethers.getContractAt("$Spaceship",process.env.CONTRACT_ADDRESS);
      console.log("Connected to external contract",contract.address)
    });
  } else {
    it("Should deploy", async function () {
      const ContractFactory = await ethers.getContractFactory("$Spaceship");
      contract = await ContractFactory.deploy();
    });
  }

  describe('safeMint()', function() {
    it('should be able to mint an nft', async function() {
      const [owner] = await ethers.getSigners();
      console.log('\t', 'tester/deployer address', owner.address);

      const startingBalance = await contract.balanceOf(owner.address);
      console.log('\t', 'startingBalance', startingBalance);

      const mintTx = await contract.safeMint(owner.address);
      console.log('\t', 'meeeeeeenting tx', mintTx.hash);

      const txResult = await mintTx.wait();
      expect(txResult.status).to.equal(1);

      console.log('\t', 'checking new balance');
      expect(await contract.balanceOf(owner.address)).to.equal(
        startingBalance.add(1)
      );
    });
  });

  describe('startGame()', function() {
    it('should be able to force start the game', async function() {
      const tx = await contract.startGame();

      const txResult = await tx.wait();
      expect(txResult.status).to.equal(1);

      console.log('\t', 'checking whether the game has started...');
      expect(await contract.hasGameStarted()).to.equal(true);
    })
  });

  describe('getCurrentDay()', function() {
    it('should correctly return the current simulation day', async function() {
      console.log('\t', 'checking the first (zeroeth) day of the simulation...');
      expect(await contract.getCurrentDay()).to.equal(0);

      console.log('\t', 'moving the simulation 1 day forward...');
      const tx = await contract.$moveGameOneDay();
      const txResult = await tx.wait();
      expect(txResult.status).to.equal(1);

      console.log('\t', 'check the 2nd (1st) day...');
      expect(await contract.getCurrentDay()).to.equal(1);
    });
  });

/*
  describe('getUnit()', function() {
    it('should be able to get correct nft data', )
  });
*/

/*
  describe('upgrade()', function() {
    it('should change the state of the game', async function() {
      const tx = await contract.upgrade(0, 1);
      const txResult = await tx.wait();
      expect(txResult.status).to.equal(1);
      console.log('\t', txResult);
    });

  });
*/

});
