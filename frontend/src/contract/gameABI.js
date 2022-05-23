const UnitData = `(
    int56 x,
    int56 y,
    uint8 level,
    uint8 lives,
    uint64 points,
    uint56 lastSimulatedDay,
)`;

const SUPPLY = 69;

const gameABI = [
  "event UnitMoved(uint256 tokenId, int56 x, int56 y)",
  "event UnitShot(uint256 tokenId, uint8 newHealth)",
  "event UnitUpgraded(uint256 tokenId, uint8 level)",
  "event UnitGavePoints(uint256 fromTokenId, uint256 toTokenId, uint64 amount)",

  "error ExceedsSupply()",
  "error NotEnoughPoints()",
  "error BadArguments()",
  "error NoAccess()",
  "error DeadSpaceship()",

  "function safeMint(address to) public",
  "function getMaxSupply() external pure returns (uint256)",
  "function getCurrentSupply() public view returns (uint256)",
  // startGame() is onlyOwner and is for testing only
  "function startGame() public",
  "function hasGameStarted() public view returns (bool)",
  "function getCurrentDay() public view returns (uint56)",
  "function getCurrentZoneRadius() public view returns (uint256)",
  "function isGameOver() public view returns (bool)",
  `function getState() public view returns(uint256 currentZoneRadius, uint256 s_gameStartTime, ${UnitData}[${SUPPLY}] memory allUnits, string[${SUPPLY}] memory images)`,
  `function move(uint256 unit, int56 x, int56 y) public`,
  `function shoot(uint256 attId, uint256 victId, uint8 damage) public`,
  `function givePoints(uint256 fromId, uint256 toId, uint64 amount) public`,
  `function upgrade(uint256 unitId, uint8 byLevels) public`,
  `function imageURI(uint256 _tokenId) public pure returns (string memory)`,
  `function tokenURI(uint256 _tokenId) public view returns (string memory)`,

  /* From ERC721 */
  `function ownerOf(uint256 tokenId) external view returns (address owner)`,
];

export default gameABI;
