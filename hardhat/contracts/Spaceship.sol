// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "erc721a/contracts/ERC721A.sol";
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Spaceship is ERC721A, VRFConsumerBaseV2, Ownable {
    VRFCoordinatorV2Interface COORDINATOR;
    uint256 constant SUPPLY = 69; // supply has to be a constant or else we have to use dynamic arrays
    int56 constant playfieldSize = 100; // it's (playfieldSize)x(playfieldSize)
    uint56 constant unsignedPlayfieldSize = uint56(playfieldSize);

    event UnitMoved(uint256 tokenId, int56 x, int56 y);
    event UnitShot(uint256 attId, uint256 victId, uint8 damage);
    event UnitUpgraded(uint256 tokenId, uint8 level);
    event UnitGavePoints(uint256 fromTokenId, uint256 toTokenId, uint56 amount);

    // this in theory should take 1 slot
    struct UnitData {
        int56 x;
        int56 y;
        uint8 level; // 0 or 1 or 2
        uint8 lives; // 0 (ded) or 1 or 2 or 3
        uint56 points;
        uint56 lastSimulatedDay;
        uint8 colorSeed;
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

    function mint(uint256 quantity) external {
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
                lastSimulatedDay: 0,
                colorSeed: uint8(random(seedArray[0] + 2))
            });

            // increment the seed
            seedArray[0] = seedArray[0] + 3;
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

    function startGame() external {
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
    // rewards
    //

    error GameNotFinishedYet();
    error SendingMoneyFailed();

    // TODO: this only covers the case of a single winner
    function takePrize(uint256 id) external {
        if (totalSupply() != SUPPLY)
            revert UnitsNotMintedYet();

        if (!hasGameStarted())
            revert GameNotStarted();

        if (ownerOf(id) != msg.sender)
            revert NoAccess();

        if (getUnit(id).lives == 0)
            revert DeadSpaceship();

        for (uint i = 0; i < SUPPLY; ++i) {
            UnitData memory unit = getUnit(i);

            if (unit.lives != 0 && i != id) {
                revert GameNotFinishedYet();
            }
        }

        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        if (!success)
            revert SendingMoneyFailed();
    }

    //
    // DEBUG
    //

/*
    function startGame() external onlyOwner {
        s_gameStartTime = block.timestamp; // TODO: maybe use a better source of time?
    }
*/

    uint256 public oneDay = 1 days;

    function setGameSpeed(uint256 _oneDay) external onlyOwner {
        oneDay = _oneDay;
    }

    function moveGameOneDay() internal {
        s_gameStartTime -= oneDay;
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

        return uint56((block.timestamp - s_gameStartTime) / oneDay);
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
    function getState() external view returns(uint256, uint256, UnitData[SUPPLY] memory) {
        if (!hasGameStarted())
            revert GameNotStarted();

        return (getCurrentZoneRadius(), s_gameStartTime, getAllUnits());
    }

    //
    // moves
    //

    // TODO: chain moves to save on gas? (several moves with 1 sload/sstore)

    error NotEnoughPoints();
    error BadArguments();
    error NoAccess();
    error DeadSpaceship();
    error NotEnoughTaxMoney();

    // TODO: check that the slot is empty
    function move(uint256 unit, int56 x, int56 y) external payable {
        if (msg.value < block.basefee) {
            revert NotEnoughTaxMoney();
        }

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
    function shoot(uint256 attId, uint256 victId, uint8 damage) external payable {
        if (msg.value < block.basefee) {
            revert NotEnoughTaxMoney();
        }

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

    function givePoints(uint256 fromId, uint256 toId, uint56 amount) external payable {
        if (msg.value < block.basefee) {
            revert NotEnoughTaxMoney();
        }

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

    function upgrade(uint256 unitId, uint8 byLevels) external payable {
        if (msg.value < block.basefee) {
            revert NotEnoughTaxMoney();
        }

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

    string constant g_fill_open_a = '<g fill=';
    string constant g_fill_open_b = '>';
    string constant g_fill_close = '</g>';

    string constant rect_x = '<rect x="';
    string constant x_y = '" y="';
    string constant y_width = '" width="';
    string constant w_height = '" height="';
    string constant h_rect = '"/>';

    uint24[] s_frame_numbers = [ // 34
        0x090021,
        0x080111,
        0x0B0111,
        0x010211,
        0x120211,
        0x07021E,
        0x0C021E,
        0x00031D,
        0x13031D,
        0x020315,
        0x110315,
        0x090321,
        0x080411,
        0x0B0411,
        0x090521,
        0x030815,
        0x100815,
        0x040921,
        0x0E0921,
        0x060811,
        0x0D0811,
        0x020D31,
        0x0F0D31,
        0x010E11,
        0x120E11,
        0x050E12,
        0x0E0E12,
        0x061031,
        0x0B1031,
        0x081111,
        0x0B1111,
        0x071211,
        0x0C1211,
        0x071361
    ];

    uint24[] s_wings_numbers = [ // 4
        0x01031B,
        0x020815,
        0x12031B,
        0x110815
    ];

    uint24[] s_body_numbers = [ // 5
        0x08081B,
        0x0B051B,
        0x09061C,
        0x0A061C,
        0x081241
    ];

    uint24[] s_extension_numbers = [ // 6
        0x040A13,
        0x0E0A13,
        0x050A14,
        0x0E0A14,
        0x060917,
        0x0D0917
    ];

    uint24[] s_cockpit_window_numbers = [ // 1
        0x090421
    ];

    uint24[] s_cockpit_numbers = [ // 3
        0x080212,
        0x090122,
        0x0B0212
    ];

    function imageSection(uint24[] storage arr, uint8 seed) internal view returns(string memory) {
        string memory result = string(abi.encodePacked(g_fill_open_a, randomHsl(seed), g_fill_open_b));

        for (uint256 i = 0; i < arr.length; ++i) {
            uint24 blob = arr[i];
            uint8 x = uint8(blob >> 16 & 0x0000FF);
            uint8 y = uint8(blob >> 8 & 0x0000FF);
            uint8 w = uint8(blob >> 4 & 0x00000F);
            uint8 h = uint8(blob & 0x00000F);
            result = string(abi.encodePacked(result,
                rect_x,
                Strings.toString(x),
                x_y,
                Strings.toString(y),
                y_width,
                Strings.toString(w),
                w_height,
                Strings.toString(h)
            ));
            result = string(abi.encodePacked(result, h_rect)); // too deep for the stack
        }

        result = string(abi.encodePacked(result, g_fill_close));
        return result;
    }

    function imageURI(uint256 _tokenId) public view returns (string memory) {
        //return string('data:image/svg+xml, <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="120" height="120"> <rect x="14" y="23" width="200" height="50" fill="lime" stroke="black" /> </svg>');

        uint8 seed = s_units[_tokenId].colorSeed;
        string memory result = string(abi.encodePacked(
            '<svg width="500" height="500" version="1.1" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">'
        ));

        // ship frame/border
        result = string(abi.encodePacked(result, imageSection(s_frame_numbers, seed)));
        ++seed;

        // both wings
        result = string(abi.encodePacked(result, imageSection(s_wings_numbers, seed)));
        ++seed;

        // ship body
        result = string(abi.encodePacked(result, imageSection(s_body_numbers, seed)));
        ++seed;

        // extension from body to the wings
        result = string(abi.encodePacked(result, imageSection(s_extension_numbers, seed)));
        ++seed;

        // cockpit window
        result = string(abi.encodePacked(result, imageSection(s_cockpit_window_numbers, seed)));
        ++seed;

        // cockpit
        result = string(abi.encodePacked(result, imageSection(s_cockpit_numbers, seed)));

        result = string(abi.encodePacked(result, '</svg>'));
        return string(abi.encodePacked('data:image/svg+xml;base64,', Base64.encode(bytes(result))));
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

    function randomHsl(uint8 seed) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '"hsl(',
            Strings.toString(randomRange(seed, 359)),
            ' 100% ',
            Strings.toString(randomRange(seed + 1, 40) + 20),
            '%)"'
        ));
    }
}
