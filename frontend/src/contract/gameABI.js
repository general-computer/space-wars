const UnitData = `(
    int56 x,
    int56 y,
    uint8 level,
    uint8 lives,
    uint56 points,
    uint56 lastSimulatedDay,
    uint8 colorSeed,
)`;

const SUPPLY = 69;

const gameABI = [
  "event UnitMoved(uint256 tokenId, int56 x, int56 y)",
  "event UnitShot(uint256 attId, uint256 victId, uint8 damage)",
  "event UnitUpgraded(uint256 tokenId, uint8 level)",
  "event UnitGavePoints(uint256 fromTokenId, uint256 toTokenId, uint56 amount)",
  // From ERC721A: https://chiru-labs.github.io/ERC721A/#/erc721a?id=events
  "event Transfer(address from, address to, uint256 tokenId)",

  "error ExceedsSupply()",
  "error NotEnoughPoints()",
  "error BadArguments()",
  "error NoAccess()",
  "error DeadSpaceship()",

  "function s_gameStartTime() public view returns(uint256)",

  "function mint(uint256 quantity) public",
  "function getMaxSupply() external pure returns (uint256)",
  "function getPlayfieldSize() public pure returns (uint56)",
  "function hasGameStarted() public view returns (bool)",
  "function getCurrentDay() public view returns (uint56)",
  "function getCurrentZoneRadius() public view returns (uint256)",
  "function isGameOver() public view returns (bool)",
  `function getState() public view returns(uint256 currentZoneRadius, uint256 s_gameStartTime, ${UnitData}[${SUPPLY}] memory allUnits, string[${SUPPLY}] memory images)`,
  `function move(uint256 unit, int56 x, int56 y) public`,
  `function shoot(uint256 attId, uint256 victId, uint8 damage) public`,
  `function givePoints(uint256 fromId, uint256 toId, uint56 amount) public`,
  `function upgrade(uint256 unitId, uint8 byLevels) public`,
  `function imageURI(uint256 _tokenId) public pure returns (string memory)`,
  `function tokenURI(uint256 _tokenId) public view returns (string memory)`,

  /* From ERC721A */
  `function ownerOf(uint256 tokenId) external view returns (address owner)`,
];

export default gameABI;
