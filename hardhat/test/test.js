const hre = require('hardhat');
const { ethers } = hre;
const { use, expect } = require('chai');
const { solidity } = require("ethereum-waffle");
const { networkConfig } = require("./../helper-hardhat-config");
const POINT_ONE_LINK = "100000000000000000";


async function getBaseFee() {
  return (await ethers.provider.getFeeData()).maxFeePerGas;
}


use(solidity)

describe("Spaceship contract", function() {
  let contract;
  let vrfCoordinatorV2Mock;

  // increase timeout for congested networks
  this.timeout(120000);

  it("Should deploy", async function () {
    const chainId = network.config.chainId;
    console.log('\t', `Deploying VRFCoordinatorV2Mock to chain id ${chainId}`);
    //const linkToken = await get("LinkToken");
    const vrfCoordinatorV2MockFactory = await ethers.getContractFactory("VRFCoordinatorV2Mock");
    vrfCoordinatorV2Mock = await vrfCoordinatorV2MockFactory.deploy(
      POINT_ONE_LINK,
      1e9 // 0.000000001 LINK per gas
    );

    const vrfCoordinatorAddress = vrfCoordinatorV2Mock.address;
    //const linkTokenAddress = linkToken.address;

    console.log('\t', 'Creating a subscription and funding it...');
    const fundAmount = networkConfig[chainId]["fundAmount"];
    const transaction = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transaction.wait(1);
    subscriptionId = ethers.BigNumber.from(transactionReceipt.events[0].topics[1]);
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, fundAmount);

    console.log('\t', 'Deploying the main contract...');
    const ContractFactory = await ethers.getContractFactory("$Spaceship");
    contract = await ContractFactory.deploy(subscriptionId, vrfCoordinatorAddress, "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc");
    console.log('\t', 'deployed to', contract.address);
  });

  describe('mint()', function() {
    //let signers;
    let owner;
    let requestId;

    it('should be able to mint an nft', async function() {
      //signers = await ethers.getSigners();
      //console.log('\t', 'signers', signers);
      [owner] = await ethers.getSigners();
      console.log('\t', 'tester/deployer address', owner.address);

      const startingBalance = await contract.balanceOf(owner.address);
      console.log('\t', 'startingBalance', startingBalance);

      const mintTx = await contract.mint(1);
      console.log('\t', 'meeeeeeenting tx', mintTx.hash);

      const txResult = await mintTx.wait();
      expect(txResult.status).to.equal(1);

      // save the request id
      const event = txResult.events.find(event => event.event === 'RandomWordsRequested');
      [requestId] = event.args;

      console.log('\t', 'checking new balance');
      expect(await contract.balanceOf(owner.address)).to.equal(
        startingBalance.add(1)
      );
    });

    it('should be able to initialize minted nfts', async function() {
      // simulate callback from the oracle network
      await expect(
        vrfCoordinatorV2Mock.fulfillRandomWords(requestId, contract.address)
      ).to.emit(contract, "ReturnedRandomness");

      const unit0 = await contract.s_units(0);
      expect(unit0.lives).to.equal(3);
    });

    it('should be able to initialize lots of nfts (have enough gas/LINK)', async function() {
      const SUPPLY = await contract.callStatic.getMaxSupply();

      console.log('\t', `minting ${SUPPLY - 1} more nfts...`);
      const tx = await contract.mint(SUPPLY - 1);
      const rc = await tx.wait();

      console.log('\t', 'checking the total supply...');
      expect(await contract.totalSupply()).to.equal(SUPPLY);

      // get the request id
      const event = rc.events.find(event => event.event === 'RandomWordsRequested');
      [requestId] = event.args;

      console.log('\t', `initializing ${SUPPLY - 1} more nfts...`);
      await expect(
        vrfCoordinatorV2Mock.fulfillRandomWords(requestId, contract.address, {gasLimit: 2200000})
      ).to.emit(contract, "ReturnedRandomness");

      //for (i = 1; i < SUPPLY; i++) {
      //  console.log('\t\t', `Checking unit ${i} for initialization...`);
      //  const unit = await contract.s_units(i);
      //  expect(unit.lives).to.equal(3);
      //}
    });

    it('should be able to start the game when all nfts are minted & initialized', async function() {
      console.log('\t', 'starting the game...');
      await contract.startGame();

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


  describe('$unitsTestFormation()', function() {
    it('should get units in test formation', async function() {
      await contract.$unitsTestFormation();

      const unit0 = await contract.s_units(0);
      expect(unit0.x).to.equal(0);
      expect(unit0.y).to.equal(0);

      const unit1 = await contract.s_units(1);
      expect(unit1.x).to.equal(0);
      expect(unit1.y).to.equal(0);
    })
  })


  describe('$getUnit()', function() {
    it('should be able to get correct nft data after 1 day of the simulation', async function() {
      const unitPre = await contract.$getUnit(0);
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
      const tx = await contract.upgrade(0, 1, {value: await getBaseFee()});
      const txResult = await tx.wait();
      expect(txResult.status).to.equal(1);

      console.log('\t', 'checking the game state');
      const unit = await contract.$getUnit(0);
      expect(unit.level).to.equal(1);
      expect(unit.points).to.equal(1);
    });

    it('should fail if unit doesn\'t have enough points', async function() {
      console.log('\t', 'trying to upgrade by 2 more levels (should be impossible)...');
      await expect(contract.upgrade(0, 2, {value: await getBaseFee()})).to.be.revertedWith('NotEnoughPoints');
    });

  });


  describe('move()', function() {
    it('should fail to move too far', async function() {
      const unitPre = await contract.$getUnit(0);

      console.log('\t', 'trying to move +(2,0)');
      await expect(contract.move(0, unitPre.x + 2, unitPre.y, {value: await getBaseFee()})).to.be.revertedWith('BadArguments');

      console.log('\t', 'trying to move +(2,0)');
      await expect(contract.move(0, unitPre.x, unitPre.y + 2, {value: await getBaseFee()})).to.be.revertedWith('BadArguments');

      console.log('\t', 'trying to move +(2,2)');
      await expect(contract.move(0, unitPre.x + 2, unitPre.y + 2, {value: await getBaseFee()})).to.be.revertedWith('BadArguments');
    });

    it('should fail to move out of bounds', async function() {
      const unitPre = await contract.$getUnit(0);
      const playfield = await contract.$unsignedPlayfieldSize();

      console.log('\t', `trying to move -(${playfield},0)`);
      await expect(contract.move(0, unitPre.x - playfield, unitPre.y, {value: await getBaseFee()})).to.be.revertedWith('BadArguments');

      console.log('\t', `trying to move -(${playfield},0)`);
      await expect(contract.move(0, unitPre.x, unitPre.y - playfield, {value: await getBaseFee()})).to.be.revertedWith('BadArguments');

      console.log('\t', `trying to move -(${playfield},${playfield})`);
      await expect(contract.move(0, unitPre.x - playfield, unitPre.y - playfield, {value: await getBaseFee()})).to.be.revertedWith('BadArguments');
    });

    it('should allow to move', async function() {
      const unitPre = await contract.$getUnit(0);

      console.log('\t', 'trying to move 1 square to the bottom-right');
      const tx = await contract.move(0, unitPre.x + 1, unitPre.y + 1, {value: await getBaseFee()});
      const txResult = await tx.wait();
      expect(txResult.status).to.equal(1);

      console.log('\t', 'checking the game state');
      const unitPost = await contract.$getUnit(0);
      expect(unitPost.points).to.equal(unitPre.points - 1);
      expect(unitPost.x).to.equal(unitPre.x + 1);
      expect(unitPost.y).to.equal(unitPre.y + 1);
    });

  });


  describe('givePoints()', function() {

    it('should fail to give more points than available', async function() {
      const unitPre0 = await contract.$getUnit(0);
      const unitPre1 = await contract.$getUnit(1);

      console.log('\t', `trying to gib ${unitPre1.points + 1}/${unitPre1.points} points from unit 1 to unit 0`);
      await expect(contract.givePoints(1, 0, unitPre1.points + 1, {value: await getBaseFee()})).to.be.revertedWith('NotEnoughPoints');
    });

    it('should gib points', async function() {
      const unitPre0 = await contract.$getUnit(0);
      const unitPre1 = await contract.$getUnit(1);

      console.log('\t', 'trying to gib 1 point from unit 1 to unit 0');
      const tx = await contract.givePoints(1, 0, 1, {value: await getBaseFee()});
      const txResult = await tx.wait();
      expect(txResult.status).to.equal(1);

      console.log('\t', 'checking the game state');
      const unitPost0 = await contract.$getUnit(0);
      const unitPost1 = await contract.$getUnit(1);
      expect(unitPost0.points).to.equal(unitPre0.points.add(1));
      expect(unitPost1.points).to.equal(unitPre1.points.sub(1));
    });

  });


  describe('shoot()', function() {

    it('should shoot enemies', async function() {
      const unitPre0 = await contract.$getUnit(0);
      const unitPre1 = await contract.$getUnit(1);

      console.log('\t', 'trying to shoot unit 1 with unit 0...');
      await contract.shoot(0, 1, 1, {value: await getBaseFee()});

      console.log('\t', 'checking the game state');
      const unitPost0 = await contract.$getUnit(0);
      const unitPost1 = await contract.$getUnit(1);
      expect(unitPost0.points).to.equal(unitPre0.points - 1);
      expect(unitPost1.lives).to.equal(unitPre1.lives - 1);
    });

  });


  describe('getCurrentZoneRadius()', function() {
    it('should return a shrinked zone after 1 day', async function () {
      const zoneRadius = await contract.getCurrentZoneRadius();
      expect(zoneRadius).to.equal(49);
    })
  });

/*
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
*/

});
