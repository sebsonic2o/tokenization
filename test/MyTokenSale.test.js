require("dotenv").config({path: "../.env"});

const Sale = artifacts.require("./MyTokenSale.sol");
const Token = artifacts.require("./MyToken.sol");

var chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Token Sale", async accounts => {
  const [deployerAccount, recipientAccount, anotherAccount] = accounts;

  it("should not have any token in the deployer account", async () => {
    let tokenInstance = await Token.deployed();

    return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
  });
});
