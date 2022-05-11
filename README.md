#Space Wars: Diplomacy

Welcome to the source code reposition Space Wars. We are one of the first live products to come out of the Chainlink 2022 Spring Hackathon.

We've created this experimental game design to see how exogenus play affects blockchain games. This code is in an alpha state and should be not be used for production or investment use.


Basic Gameplay Overview
Space Wars is an on-chain strategy game with player-run alliances and diplomacy.

After mint, a random location is chosen for each spaceship. Each ship is powered by [fusion charges] that replentish at a rate of 1 per 24 hours. To move in the X or Y direction consumes one energy - and to attack another spaceship consumes one as well. 

Spaceships can also use an energy point to upgrade the range of their ship's weapons, up to a maximum of 3 range.

After the first day, a magnetic storm constricts the playfield - forcing players to move or be destroyed.  

Technical Implementation Details

Ethereum Mainnet, developed using Hardhat, npm, React, Redux, react-boilerplate (by @nokTNL) and Chainlink VRF.
