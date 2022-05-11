# Space Wars: Diplomacy

Welcome to the source code reposition Space Wars. We are one of the first live products to come out of the Chainlink 2022 Spring Hackathon.

We've created this experimental game design to see how exogenus play affects blockchain games. This code is in an alpha state and should be not be used for production, investment, or any use.
![image](https://user-images.githubusercontent.com/99992004/167917993-5b285730-4a52-4fe1-9da6-dd26c329d2de.png)


## Basic Gameplay Overview
Space Wars is an on-chain strategy game with player-run alliances and diplomacy.

After mint, a random location is chosen for each spaceship. Each ship is powered by [ that replentish at a rate of 1 per 24 hours. To move in the X or Y direction consumes one energy - and to attack another spaceship consumes one as well. 

Spaceships can also use an energy point to upgrade the range of their ship's weapons, up to a maximum of 3 range.

After the first day, a magnetic storm constricts the playfield - forcing players to move or be destroyed. It advances from all directions by a single cell a day.

## Technical Implementation Details

We've chosen to deploy to Ethereum Mainnet for robustness, at the expense of higher gas costs. This game is not designed to be an efficient investment scheme, or any sort of permanent platform: each round is a self-contained project, and once the  prize money is paid out, the NFTs are primarily for display. 

Space Wars: Diplomacy is developed as a fully decentralized app: if you receive a compressed copy of the website , you should be able to unpack it, open it in your browser, and, upon connecting to the blockchain, be able to access all of the features of the application.

Frontend: React, Redux, ethers.js, Styled Components+CSS Modules, Bootstrap
### React & Redux
React was chosen for speed of development and because of the familiarity of @NokTNL, our front-end developer.

### Ethers.js
While we have worked successfully with web3.js before, our backend developer appreciates the more modern implementation of ethers.js to connect to our customer's wallets.

### Bootstrap + Styled Components
Making everything look good on the frontend isn't easy, so we picked up a styling framework and some styled components to help out.

# Contributors
For the front end, we utilized the considerable skills of @nokTNL to do React development: using his self-maintained collection of tools, he's produced graphics and code displaying ten thousand tiles quickly and quietly. As the contract itself functions as the backend, @kibou provides an efficient, secure implementation of our ERC-20 Energy Points and keeps tally of each spaceship's shield.





