// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "erc721a/contracts/ERC721A.sol";
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract Spaceship is ERC721A, VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface COORDINATOR;
    uint256 constant SUPPLY = 69; // supply has to be a constant or else we have to use dynamic arrays
    int56 constant playfieldSize = 100; // it's (playfieldSize)x(playfieldSize)
    uint56 constant unsignedPlayfieldSize = uint56(playfieldSize);

    event UnitMoved(uint256 tokenId, int56 x, int56 y);
    event UnitShot(uint256 attId, uint256 victId, uint8 damage);
    event UnitUpgraded(uint256 tokenId, uint8 level);
    event UnitGavePoints(uint256 fromTokenId, uint256 toTokenId, uint64 amount);

    // this in theory should take 1 slot
    struct UnitData {
        int56 x;
        int56 y;
        uint8 level; // 0 or 1 or 2
        uint8 lives; // 0 (ded) or 1 or 2 or 3
        uint64 points;
        uint56 lastSimulatedDay;
    }

    // structs in ethers.js https://github.com/ethers-io/ethers.js/issues/315
    UnitData[SUPPLY] public s_units;
    uint256 public s_gameStartTime = 0;

    error GameNotStarted();

    function getMaxSupply() external pure returns (uint256) {
        return SUPPLY;
    }

    function getPlayfieldSize() public pure returns (uint56) {
        return unsignedPlayfieldSize;
    }

    //
    // minting & chainlink vrf variables/constants
    //

    uint64 s_subscriptionId;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    //bytes32 keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    bytes32 keyHash;

    struct RequestRange {
        uint128 start;
        uint128 end;
    }
    mapping(uint256 => RequestRange) public s_vrfRequests; // maps request ids to a range of units [(last_unit_at_-1_-1), (s_vrfRequests[requestId]))

    error ExceedsSupply();

    //
    // minting & chainlink vrf code
    //

    constructor(uint64 subscriptionId, address vrfCoordinator, bytes32 _keyHash) VRFConsumerBaseV2(vrfCoordinator) ERC721A("Spaceship", "SHIP") {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
        keyHash = _keyHash;
    }

    function mint(uint256 quantity) public {
        console.log('mint', quantity);
        if (totalSupply() >= SUPPLY)
            revert ExceedsSupply();

        _safeMint(msg.sender, quantity);

        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            3, // request confirmations
            uint32(50000 + 30000*quantity), // callback gas limit
            //4294967295,
            1 // amount of words
        );

        s_vrfRequests[requestId] = RequestRange(uint128(totalSupply() - quantity), uint128(totalSupply()));
        emit RandomWordsRequested(requestId);
    }

    event ReturnedRandomness(); // todo: better name?
    event RandomWordsRequested(uint256 requestId);

    function fulfillRandomWords(
        uint256 requestId, /* requestId */
        uint256[] memory seedArray // seedArray[0] is the random seed
    ) internal override {
        RequestRange memory range = s_vrfRequests[requestId];
        uint256 lastTokenId = range.end;
        uint256 tokenId = range.start;
        console.log('fulfillRandomWords', requestId, seedArray[0]);
        console.log('from', tokenId, 'until', lastTokenId);

        for (; tokenId < lastTokenId; ++tokenId) {
            s_units[tokenId] = UnitData({
                x: int56(uint56(randomRange(seedArray[0], unsignedPlayfieldSize))),
                y: int56(uint56(randomRange(seedArray[0] + 1, unsignedPlayfieldSize))),

                level: 0,
                points: 1,
                lives: 3,
                lastSimulatedDay: 0
            });

            // increment the seed
            seedArray[0] = seedArray[0] + 2;
        }

        // since the order of requests is not guaranteed this won't always work
        //if (tokenId == SUPPLY) {
        //    s_gameStartTime = block.timestamp; // TODO: maybe use a better source of time?
        //    console.log('Started the game.');
        //}

        emit ReturnedRandomness();
    }

    error UnitsNotMintedYet();
    error GameAlreadyStarted();
    error UnitsNotInitializedYet(uint256 uninitializedTokenId);

    function startGame() public {
        if (totalSupply() != SUPPLY)
            revert UnitsNotMintedYet();

        if (hasGameStarted())
            revert GameAlreadyStarted();

        for (uint256 tokenId = 0; tokenId < SUPPLY; ++tokenId) {
            // checks whether the unit has been initialized
            // it'd be better to check whether the entire word is 0 but idk how
            if (s_units[tokenId].lives == 0)
                revert UnitsNotInitializedYet(tokenId);
        }

        s_gameStartTime = block.timestamp;
        console.log('Started the game.');
    }

    //
    // DEBUG
    //

/*
    function startGame() public onlyOwner {
        s_gameStartTime = block.timestamp; // TODO: maybe use a better source of time?
    }
*/

    function moveGameOneDay() internal {
        s_gameStartTime -= 1 days;
    }

    function unitsTestFormation() internal {
        s_units[0].x = 0;
        s_units[0].y = 0;
        s_units[1].x = 0;
        s_units[1].y = 0;
    }

    //
    // game state getters/builders
    // (these things restore the current game state, hence "builders")
    //

    function hasGameStarted() public view returns (bool) {
        //return totalSupply() >= SUPPLY;
        return s_gameStartTime != 0;
    }

    function getCurrentDay() public view returns (uint56) { // it's prob gonna be shorter than 256 later
        if (!hasGameStarted())
            revert GameNotStarted();

        return uint56((block.timestamp - s_gameStartTime) / (1 days));
    }

    // zone size decreases by 1 per day (speed is subject to change)
    function getZoneRadius(uint56 day) internal pure returns (uint56) {
        return (day > (unsignedPlayfieldSize/2)) ? 0 : ((unsignedPlayfieldSize/2) - day);
    }

    function getCurrentZoneRadius() public view returns (uint256) {
        if (!hasGameStarted())
            revert GameNotStarted();

        return getZoneRadius(getCurrentDay());
    }

    // TODO: returns true when only 1 player left alive
    function isGameOver() public view returns (bool) {
        if (!hasGameStarted())
            revert GameNotStarted();

        return false;
    }

    // this is where the magic happens
    // simulates 1 day worth of "external" changes to a unit
    function simulateUnitOnce(UnitData memory unit) internal pure returns (UnitData memory) {
        ++unit.lastSimulatedDay;

        // take helth from zon
        if (unit.lives > 0 && !inCircle(playfieldSize/2, playfieldSize/2, int56(uint56(getZoneRadius(unit.lastSimulatedDay))), unit.x, unit.y)) {
            --unit.lives;
        }

        // gib points
        if (unit.lives > 0) {
            ++unit.points;
        }

        return unit;
    }

    // simulates the unit out until today
    // TODO: cap the amount of days (according to the block gas limit)
    function simulateUnitOut(UnitData memory unit) internal view returns (UnitData memory) {
        for (uint256 day = unit.lastSimulatedDay; day < getCurrentDay(); ++day) {
            unit = simulateUnitOnce(unit);
        }

        return unit;
    }

    function getUnit(uint256 id) internal view returns (UnitData memory) {
        return simulateUnitOut(s_units[id]);
    }

    function getAllUnits() internal view returns (UnitData[SUPPLY] memory) {
        UnitData[SUPPLY] memory units;
        for (uint256 id = 0; id < totalSupply(); ++id) {
            units[id] = getUnit(id);
        }
        return units;
    }

    // this function is called by the browser when you open the game
    function getState() external view returns(uint256, uint256, UnitData[SUPPLY] memory, string[SUPPLY] memory) {
        if (!hasGameStarted())
            revert GameNotStarted();

        uint256 amt = totalSupply();
        string[SUPPLY] memory images;

        for (uint256 i = 0; i < amt; ++i) {
            images[i] = imageURI(i);
        }

        return (getCurrentZoneRadius(), s_gameStartTime, getAllUnits(), images);
    }

    //
    // moves
    //

    // TODO: chain moves to save on gas? (several moves with 1 sload/sstore)

    error NotEnoughPoints();
    error BadArguments();
    error NoAccess();
    error DeadSpaceship();

    // TODO: check that the slot is empty
    function move(uint256 unit, int56 x, int56 y) public {
        // limit the play field
        if (x < 0 || y < 0 || x >= playfieldSize || y >= playfieldSize)
            revert BadArguments();

        if (ownerOf(unit) != msg.sender)
            revert NoAccess();

        if (!hasGameStarted())
            revert GameNotStarted();

        UnitData memory data = getUnit(unit);

        if (data.lives == 0)
            revert DeadSpaceship();

        if (data.points == 0)
            revert NotEnoughPoints();

        // prevent moving more than 1 step in any direction (including diagonally)
        if ((data.x == x && data.y == y) || (!inCircle(data.x, data.y, 1, x, y)))
            revert BadArguments();

        --data.points;
        data.x = x;
        data.y = y;
        s_units[unit] = data;

        emit UnitMoved(unit, x, y);
    }

    // the damage type matches UnitData.lives type here
    function shoot(uint256 attId, uint256 victId, uint8 damage) public {
        if (attId == victId || damage == 0)
            revert BadArguments();

        if (ownerOf(attId) != msg.sender)
            revert NoAccess();

        if (!hasGameStarted())
            revert GameNotStarted();

        UnitData memory att = getUnit(attId);

        if (damage > att.points)
            revert NotEnoughPoints();

        if (att.lives == 0)
            revert DeadSpaceship();

        UnitData memory vict = getUnit(victId);

        if (damage > vict.lives)
            revert BadArguments();

        if (!inCircle(att.x, att.y, int56(uint56(att.level) + 1), vict.x, vict.y))
            revert BadArguments();

        att.points -= damage;
        vict.lives -= damage;

        s_units[attId] = att;
        s_units[victId] = vict;

        emit UnitShot(attId, victId, damage);
    }

    function givePoints(uint256 fromId, uint256 toId, uint64 amount) public {
        if (fromId == toId || amount == 0)
            revert BadArguments();

        if (ownerOf(fromId) != msg.sender)
            revert NoAccess();

        if (!hasGameStarted())
            revert GameNotStarted();

        UnitData memory from = getUnit(fromId);

        if (amount > from.points)
            revert NotEnoughPoints();

        if (from.lives == 0)
            revert DeadSpaceship();

        UnitData memory to = getUnit(toId);

        if (to.lives == 0)
            revert DeadSpaceship();

        from.points -= amount;
        to.points += amount;

        s_units[toId] = to;
        s_units[fromId] = from;

        emit UnitGavePoints(fromId, toId, amount);
    }

    function upgrade(uint256 unitId, uint8 byLevels) public {
        if (byLevels == 0)
            revert BadArguments();

        if (ownerOf(unitId) != msg.sender)
            revert NoAccess();

        if (!hasGameStarted())
            revert GameNotStarted();

        UnitData memory unit = getUnit(unitId);

        if (byLevels > unit.points)
            revert NotEnoughPoints();

        if (unit.lives == 0)
            revert DeadSpaceship();

        uint8 newLevel = unit.level + byLevels;
        if (newLevel > 2)
            revert BadArguments();

        unit.points -= byLevels;
        unit.level = newLevel;
        s_units[unitId] = unit;

        emit UnitUpgraded(unitId, newLevel);
    }

    //
    // metadata
    //

    function imageURI(uint256 _tokenId) public pure returns (string memory) {
        return string('data:image/svg+xml, <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="120" height="120"> <rect x="14" y="23" width="200" height="50" fill="lime" stroke="black" /> </svg>');
    }

    // TODO: return properties
    function tokenURI(uint256 _tokenId) override public view returns (string memory) {
        return string(abi.encodePacked(
            'data:application/json,'
            '{"name": "space sheep", "description": "spaceship go brrrr", "image":"',
            imageURI(_tokenId),
            '"}'
        ));
    }

    //
    // utilities
    //

    function abs(int56 x) internal pure returns (int56) {
        return x < 0 ? -x : x;
    }

    // is actually a square, am dumb.
    function inCircle(int56 centre_x, int56 centre_y, int56 size, int56 x, int56 y) internal pure returns (bool) {
        return ((abs(centre_x - x) <= size) && (abs(centre_y - y) <= size));
    }

    // returns a number generated from seed
    // will always return the same number for the same seed
    function random(uint256 seed) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(seed)));
    }

    // returns a number in range [0, max)
    function randomRange(uint256 seed, uint256 max) internal pure returns (uint256) {
        return random(seed) % max;
    }
}
