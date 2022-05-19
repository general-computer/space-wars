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


  describe('$getUnit()', function() {
    it('should be able to get correct nft data after 1 day of the simulation', async function() {
      const unitPre = await contract.callStatic.$getUnit(0);
      expect(unitPre.x).to.equal(0);
      expect(unitPre.y).to.equal(0);
      expect(unitPre.level).to.equal(0);
      expect(unitPre.points).to.equal(2);
      expect(unitPre.lives).to.equal(2); // (0,0) = in zone after a day
    });
  });


  describe('upgrade()', function() {
    it('should work...', async function() {
      console.log('\t', 'trying to upgrade by 1 level...');
      const tx = await contract.upgrade(0, 1);
      const txResult = await tx.wait();
      expect(txResult.status).to.equal(1);

      console.log('\t', 'checking the game state');
      const unit = await contract.callStatic.$getUnit(0);
      expect(unit.level).to.equal(1);
      expect(unit.points).to.equal(1);

/*
      console.log('\t', 'trying to upgrade by 2 more levels (should be impossible)...');
      const tx2 = await contract.upgrade(0, 2);
      const tx2Result = await tx2.wait();
      //expect(txResult.status).to.equal(1);
      console.log('\t', tx2Result);
*/
    });

  });


  describe('getState()', function() {
    it('should return the correct game state after our manipulations', async function() {
      const [zoneRadius, gameStartTime, units, images] = await contract.callStatic.getState();
      expect(zoneRadius).to.equal(49);
      //expect(gameStartTime).to.equal(99);
      //expect(units.length).to.equal(1);
      //expect(images.length).to.equal(1);

      const unit = units[0];
      expect(unit.x).to.equal(0);
      expect(unit.y).to.equal(0);
      expect(unit.level).to.equal(1);
      expect(unit.points).to.equal(1);
      expect(unit.lives).to.equal(2);

      expect(images[0]).to.equal('data:image/svg+xml, <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="120" height="120"> <rect x="14" y="23" width="200" height="50" fill="lime" stroke="black" /> </svg>');
    });
  });

});
