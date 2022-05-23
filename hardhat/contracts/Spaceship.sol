// SPDX-License-Identifier: MIT
// https://twitter.com/Kibou_web3
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; // TODO: use a more optimized base
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Spaceship is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    // TODO: replace the counter
    Counters.Counter private _tokenIdCounter;
    uint256 constant SUPPLY = 69; // supply has to be a constant or else we have to use dynamic arrays
    int56 constant playfieldSize = 100; // it's (playfieldSize)x(playfieldSize)
    uint56 constant unsignedPlayfieldSize = uint56(playfieldSize);

    event UnitMoved(uint256 tokenId, int56 x, int56 y);
    event UnitShot(uint256 tokenId, uint8 newHealth);
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

    constructor() ERC721("Spaceship", "SHIP") {}

    error ExceedsSupply();

    function safeMint(address to) public {
        uint256 tokenId = _tokenIdCounter.current();
        if (hasGameStarted())
            revert ExceedsSupply();

        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        s_units[tokenId] = UnitData({
            x: 0,
            y: 0,

            level: 0,
            points: 1,
            lives: 3,
            lastSimulatedDay: 0
        });

        if (tokenId == SUPPLY) {
            s_gameStartTime = block.timestamp; // TODO: maybe use a better source of time?
        }
    }

    function getMaxSupply() external pure returns (uint256) {
        return SUPPLY;
    }

    function getCurrentSupply() public view returns (uint256) {
        return _tokenIdCounter.current() + 1;
    }

    function getPlayfieldSize() public pure returns (uint56) {
        return unsignedPlayfieldSize;
    }

    //
    // DEBUG
    //

    function startGame() public onlyOwner {
        s_gameStartTime = block.timestamp; // TODO: maybe use a better source of time?
    }

    function moveGameOneDay() internal {
        s_gameStartTime -= 1 days;
    }

    //
    // game state getters/builders
    // (these things restore the current game state, hence "builders")
    //

    function hasGameStarted() public view returns (bool) {
        //return getCurrentSupply() >= SUPPLY;
        return s_gameStartTime != 0;
    }

    function getCurrentDay() public view returns (uint56) { // it's prob gonna be shorter than 256 later
        return uint56((block.timestamp - s_gameStartTime) / (1 days));
    }

    // zone size decreases by 1 per day (speed is subject to change)
    function getZoneRadius(uint56 day) internal pure returns (uint56) {
        return (day > (unsignedPlayfieldSize/2)) ? 0 : ((unsignedPlayfieldSize/2) - day);
    }

    function getCurrentZoneRadius() public view returns (uint256) {
        return getZoneRadius(getCurrentDay());
    }

    // TODO: returns true when only 1 player left alive
    function isGameOver() public view returns (bool) {
        return false;
    }

    // this is where the magic happens
    // simulates 1 day worth of "external" changes to a unit
    function simulateUnitOnce(UnitData memory unit) internal pure returns (UnitData memory) {
        ++unit.lastSimulatedDay;

        // take helth from zon
        if (unit.lives > 0 && !inCircle(playfieldSize/2, playfieldSize/2, int56(uint56(getZoneRadius(unit.lastSimulatedDay))), unit.x, unit.y)) {
            unit.lives--;
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
        for (uint256 id = 0; id <= _tokenIdCounter.current(); ++id) {
            units[id] = getUnit(id);
        }
        return units;
    }

    // this function is called by the browser when you open the game
    function getState() external view returns(uint256, uint256, UnitData[SUPPLY] memory, string[SUPPLY] memory) {
        uint256 amt = _tokenIdCounter.current();
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

        UnitData memory data = getUnit(unit);

        if (data.lives == 0)
            revert DeadSpaceship();

        if (data.points == 0)
            revert NotEnoughPoints();

        // prevent moving more than 1 step in any direction (including diagonally)
        if ((data.x == x && data.y == y) || (!inCircle(data.x, data.y, 1, x, y)))
            revert BadArguments();

        data.points--;
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

        emit UnitShot(victId, vict.lives);
    }

    function givePoints(uint256 fromId, uint256 toId, uint64 amount) public {
        if (fromId == toId || amount == 0)
            revert BadArguments();

        if (ownerOf(fromId) != msg.sender)
            revert NoAccess();

        UnitData memory from = getUnit(fromId);

        if (amount > from.points)
            revert NotEnoughPoints();

        if (from.lives == 0)
            revert DeadSpaceship();

        UnitData memory to = getUnit(toId);

        if (!inCircle(from.x, from.y, int56(uint56(from.level) + 1), to.x, to.y))
            revert BadArguments();

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
}
