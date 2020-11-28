// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 _initialSupply) public ERC20("StarDucks Cappuccino Token", "CAPPU") {
        _mint(msg.sender, _initialSupply);
        _setupDecimals(0);
    }
}
