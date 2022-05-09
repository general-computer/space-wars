// SPDX-License-Identifier: MIT
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

    constructor() ERC721("Spaceship", "SHIP") {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        s_units[tokenId] = UnitData({
            x: 0,
            y: 0,

            level: 0,
            points: 1,
            lives: 3
        });
    }

    uint256 public startTime;
    function startGame() public onlyOwner {
        startTime = block.timestamp; // is it better to pass it as an argument? hmmmmmmmmm
    }

    uint256 public currentDay;
    uint256 zoneSize = 100;

    function simulateDay() public onlyOwner {
        currentDay++;
        zoneSize--;

        // take helth from zon
        // gib points
    }

    // this in theory should take 1 slot
    struct UnitData {
        int56 x;
        int56 y;
        uint8 level; // 0 or 1 or 2
        uint8 lives; // 0 (ded) or 1 or 2 or 3
        uint128 points;
    }

    // structs in ethers.js https://github.com/ethers-io/ethers.js/issues/315
    UnitData[SUPPLY] public s_units;

/*
    function inRange(uint256 unitAtt, uint256 unitVict) public view returns (bool) {
        UnitData attData = s_units[unitAtt];
        UnitData victData = s_units[unitVict];

        return ((attData.x - victData.x)**2 + (attData.y - victData.y)**2) <= (attData.level + 1)**2;
    }
*/

    function abs(int56 x) internal pure returns (int56) {
        return x < 0 ? -x : x;
    }

    function inCircle(int56 centre_x, int56 centre_y, int56 size, int56 x, int56 y) internal pure returns (bool) {
        return ((abs(centre_x - x) <= size) && (abs(centre_y - y) <= size));
    }

    // moves
    // TODO: chain moves to save on gas? (several moves with 1 sload/sstore)

    error NotEnoughPoints();
    error BadArguments();
    error NoAccess();

    int56 constant playfieldSize = 100;
    function move(uint256 unit, int56 x, int56 y) public {
        // limit the play field
        if (x < -playfieldSize || x > playfieldSize || y < -playfieldSize || y > playfieldSize)
            revert BadArguments();

        if (ownerOf(unit) != msg.sender)
            revert NoAccess();

        UnitData memory data = s_units[unit];

        if (data.points == 0)
            revert NotEnoughPoints();

        // prevent moving more than 1 step in any direction (including diagonally)
        if ((data.x == x && data.y == y) || (!inCircle(data.x, data.y, 1, x, y)))
            revert BadArguments();

        data.points--;
        data.x = x;
        data.y = y;
        s_units[unit] = data;
    }

    // the damage type matches UnitData.lives type here
    function shoot(uint256 attId, uint256 victId, uint8 damage) public {
        if (attId == victId || damage == 0)
            revert BadArguments();

        if (ownerOf(attId) != msg.sender)
            revert NoAccess();

        UnitData memory att = s_units[attId];

        if (damage > att.points)
            revert NotEnoughPoints();

        UnitData memory vict = s_units[victId];

        if (damage > vict.lives)
            revert BadArguments();

        if (!inCircle(att.x, att.y, int56(uint56(att.level) + 1), vict.x, vict.y))
            revert BadArguments();

        att.points -= damage;
        vict.lives -= damage;

        s_units[attId] = att;
        s_units[victId] = vict;
    }

    function givePoints(uint256 fromId, uint256 toId, uint128 amount) public {
        if (fromId == toId || amount == 0)
            revert BadArguments();

        if (ownerOf(fromId) != msg.sender)
            revert NoAccess();

        UnitData memory from = s_units[fromId];

        if (amount > from.points)
            revert NotEnoughPoints();

        from.points -= amount;
        s_units[toId].points += amount;
        s_units[fromId] = from;
    }

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
    // get the entire game state
    //

    // this function is called by the browser when you open the game
    function getState() external view returns(uint256, uint256, UnitData[SUPPLY] memory, string[SUPPLY] memory) {
        uint256 amt = _tokenIdCounter.current();
        string[SUPPLY] memory images;

        for (uint256 i = 0; i < amt; i++) {
            images[i] = imageURI(i);
        }

        return (zoneSize, currentDay, s_units, images);
    }
}
