## Front-end to-do

- Add checks on mock moves: 1. clashing on other ships, 2. hitting map boudary, 3. running out of APs
- Responsiveness: deliver map length to transform component children using getComputedStyle()?

- Add Error boundary
- Re-structure folder structures

### Simulated state (check using block.timestamp)

- zone shrink
- people outside zone -1 point every day
- AP increase 1 every day

- function that returns game state (zone size, units)
- events to change the game state
- event UnitMoved(uint256 tokenId, uint256 x, uint256 y);
- event UnitDamaged(uint256 tokenId, uint256 newHealth);
- event UnitUpgraded(uint256 tokenId, uint256 level);
- event UnitBalanceChange(uint256 tokenId, uint256 newBalance);
