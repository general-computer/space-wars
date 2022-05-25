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

  describe('mint()', function() {
    let owner;

    it('should be able to mint an nft', async function() {
      [owner] = await ethers.getSigners();
      console.log('\t', 'tester/deployer address', owner.address);

      const startingBalance = await contract.balanceOf(owner.address);
      console.log('\t', 'startingBalance', startingBalance);

      const mintTx = await contract.mint(1);
      console.log('\t', 'meeeeeeenting tx', mintTx.hash);

      const txResult = await mintTx.wait();
      expect(txResult.status).to.equal(1);

      console.log('\t', 'checking new balance');
      expect(await contract.balanceOf(owner.address)).to.equal(
        startingBalance.add(1)
      );
    });

    it('should be able to start the game when all nfts are minted', async function() {
      const SUPPLY = await contract.callStatic.getMaxSupply();
      console.log('\t', `minting ${SUPPLY - 1} more nfts...`);

      await contract.mint(SUPPLY - 1);

      console.log('\t', 'checking the total supply...');
      expect(await contract.totalSupply()).to.equal(SUPPLY);

      console.log('\t', 'checking whether the game has started...');
      expect(await contract.hasGameStarted()).to.equal(true);
    });

    it('shouldn\'t be able to mint (SUPPLY+1) nfts', async function() {
      await expect(contract.mint(1)).to.be.revertedWith('ExceedsSupply');
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
    it('should allow upgrading', async function() {
      console.log('\t', 'trying to upgrade by 1 level...');
      const tx = await contract.upgrade(0, 1);
      const txResult = await tx.wait();
      expect(txResult.status).to.equal(1);

      console.log('\t', 'checking the game state');
      const unit = await contract.callStatic.$getUnit(0);
      expect(unit.level).to.equal(1);
      expect(unit.points).to.equal(1);
    });

    it('should fail if unit doesn\'t have enough points', async function() {
      console.log('\t', 'trying to upgrade by 2 more levels (should be impossible)...');
      await expect(contract.upgrade(0, 2)).to.be.revertedWith('NotEnoughPoints');
    });

  });


  describe('move()', function() {
    it('should fail to move too far', async function() {
      const unitPre = await contract.callStatic.$getUnit(0);

      console.log('\t', 'trying to move +(2,0)');
      await expect(contract.move(0, unitPre.x + 2, unitPre.y)).to.be.revertedWith('BadArguments');

      console.log('\t', 'trying to move +(2,0)');
      await expect(contract.move(0, unitPre.x, unitPre.y + 2)).to.be.revertedWith('BadArguments');

      console.log('\t', 'trying to move +(2,2)');
      await expect(contract.move(0, unitPre.x + 2, unitPre.y + 2)).to.be.revertedWith('BadArguments');
    });

    it('should fail to move out of bounds', async function() {
      const unitPre = await contract.callStatic.$getUnit(0);

      console.log('\t', 'trying to move -(2,0)');
      await expect(contract.move(0, unitPre.x - 2, unitPre.y)).to.be.revertedWith('BadArguments');

      console.log('\t', 'trying to move -(2,0)');
      await expect(contract.move(0, unitPre.x, unitPre.y - 2)).to.be.revertedWith('BadArguments');

      console.log('\t', 'trying to move -(2,2)');
      await expect(contract.move(0, unitPre.x - 2, unitPre.y - 2)).to.be.revertedWith('BadArguments');
    });

    it('should allow to move', async function() {
      const unitPre = await contract.callStatic.$getUnit(0);

      console.log('\t', 'trying to move 1 square to the bottom-right');
      const tx = await contract.move(0, unitPre.x + 1, unitPre.y + 1);
      const txResult = await tx.wait();
      expect(txResult.status).to.equal(1);

      console.log('\t', 'checking the game state');
      const unitPost = await contract.callStatic.$getUnit(0);
      expect(unitPost.points).to.equal(unitPre.points - 1);
      expect(unitPost.x).to.equal(unitPre.x + 1);
      expect(unitPost.y).to.equal(unitPre.y + 1);
    });

  });


  describe('givePoints()', function() {

    it('should fail to give more points than available', async function() {
      const unitPre0 = await contract.callStatic.$getUnit(0);
      const unitPre1 = await contract.callStatic.$getUnit(1);

      console.log('\t', `trying to gib ${unitPre1.points + 1}/${unitPre1.points} points from unit 1 to unit 0`);
      await expect(contract.givePoints(1, 0, unitPre1.points + 1)).to.be.revertedWith('NotEnoughPoints');
    });

    it('should gib points', async function() {
      const unitPre0 = await contract.callStatic.$getUnit(0);
      const unitPre1 = await contract.callStatic.$getUnit(1);

      console.log('\t', 'trying to gib 1 point from unit 1 to unit 0');
      const tx = await contract.givePoints(1, 0, 1);
      const txResult = await tx.wait();
      expect(txResult.status).to.equal(1);

      console.log('\t', 'checking the game state');
      const unitPost0 = await contract.callStatic.$getUnit(0);
      const unitPost1 = await contract.callStatic.$getUnit(1);
      expect(unitPost0.points).to.equal(unitPre0.points + 1);
      expect(unitPost1.points).to.equal(unitPre1.points - 1);
    });

  });


  describe('shoot()', function() {

    it('should shoot enemies', async function() {
      const unitPre0 = await contract.callStatic.$getUnit(0);
      const unitPre1 = await contract.callStatic.$getUnit(1);

      console.log('\t', 'trying to shoot unit 1 with unit 0...');
      await contract.shoot(0, 1, 1);

      console.log('\t', 'checking the game state');
      const unitPost0 = await contract.callStatic.$getUnit(0);
      const unitPost1 = await contract.callStatic.$getUnit(1);
      expect(unitPost0.points).to.equal(unitPre0.points - 1);
      expect(unitPost1.lives).to.equal(unitPre1.lives - 1);
    });

  });


  describe('getState()', function() {
    let zoneRadius, gameStartTime, units, images
    it('should return the correct game state after our manipulations', async function() {
      [zoneRadius, gameStartTime, units, images] = await contract.callStatic.getState();
      expect(zoneRadius).to.equal(49);
      //expect(gameStartTime).to.equal(99);
      //expect(units.length).to.equal(1);
      //expect(images.length).to.equal(1);

      const unit = units[0];
      expect(unit.x).to.equal(1);
      expect(unit.y).to.equal(1);
      expect(unit.level).to.equal(1);
      expect(unit.points).to.equal(0);
      expect(unit.lives).to.equal(2);

      expect(images[0]).to.equal('data:image/svg+xml, <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="120" height="120"> <rect x="14" y="23" width="200" height="50" fill="lime" stroke="black" /> </svg>');
    });

    it('should return all units in an initialized state', async function() {
      console.log('\t', 'Checking whether the lives of all units != 0...');
      for (i = 0; i < (await contract.callStatic.getMaxSupply()); i++) {
        expect(units[i].lives).to.not.equal(0);
      }
    })
  });


});
