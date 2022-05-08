- V Rewrite redux logic
- V Let user choose your ship
- V let player choose no spacship
- V Allow user choose ship from same address again
- V Handle player has no ships
- V Handle wallet disconnection; no address & ship chosen

- Enable blinking on chosen ship
- When disconnected, don't blink any ship (maybe zoom out too) +
- Center chosen ship on clicking own ship

- Add Error boundary
- Re-structure folder structures

- function that returns game state (zone size, units)
- events to change the game state
- event UnitMoved(uint256 tokenId, uint256 x, uint256 y);
- event UnitDamaged(uint256 tokenId, uint256 newHealth);
- event UnitUpgraded(uint256 tokenId, uint256 level);
- event UnitBalanceChange(uint256 tokenId, uint256 newBalance);
