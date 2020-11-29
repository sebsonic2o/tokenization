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

  it("should have all tokens in the crowdsale contract by default", async () => {
    let tokenInstance = await Token.deployed();
    let totalSupply = await tokenInstance.totalSupply();

    return expect(tokenInstance.balanceOf(Sale.address)).to.eventually.be.a.bignumber.equal(totalSupply);
  });

  it("should be possible to buy a token by sending ether to the crowdsale contract", async () => {
    let tokenInstance = await Token.deployed();
    let saleInstance = await Sale.deployed();
    let balanceBefore = await tokenInstance.balanceOf(recipientAccount);

    expect(saleInstance.sendTransaction({from: recipientAccount, value: web3.utils.toWei("1", "wei")})).to.eventually.be.fulfilled;
    return expect(tokenInstance.balanceOf(recipientAccount)).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(1)));
  });
});
