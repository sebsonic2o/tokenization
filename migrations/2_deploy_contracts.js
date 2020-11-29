require("dotenv").config({path: "../.env"});

var MyKYC = artifacts.require("./MyKYC.sol");
var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSale = artifacts.require("./MyTokenSale.sol");

module.exports = async function(deployer) {
  let addr = await web3.eth.getAccounts();
  await deployer.deploy(MyKYC);
  await deployer.deploy(MyToken, process.env.INITIAL_TOKENS);
  await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address, MyKYC.address);
  let tokenInstance = await MyToken.deployed();
  await tokenInstance.transfer(MyTokenSale.address, process.env.INITIAL_TOKENS);
};
