// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MyKYC is Ownable {
    mapping(address => bool) allowed;

    function completeKYC(address _addr) public onlyOwner {
        allowed[_addr] = true;
    }

    function revokeKYC(address _addr) public onlyOwner {
        allowed[_addr] = false;
    }

    function checkKYC(address _addr) public view returns(bool) {
        return allowed[_addr];
    }
}
