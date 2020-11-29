require("dotenv").config({path: "../.env"});

const Token = artifacts.require("./MyToken.sol");

var chai = require("chai");

const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

contract("Token", async accounts => {
  const [deployerAccount, recipientAccount, anotherAccount] = accounts;

  beforeEach(async () => {
    this.myToken = await Token.new(process.env.INITIAL_TOKENS);
  });

  it("should have all tokens in the deployer account", async () => {
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();

    expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
  });

  it("should be possible to send tokens between accounts", async () => {
    const sendTokens = 1;
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();

    expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    expect(instance.transfer(recipientAccount, sendTokens)).to.eventually.be.fulfilled;
    expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
    expect(instance.balanceOf(recipientAccount)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
  });

  it("should not be possible to send more tokens than available", async () => {
    let instance = this.myToken;
    let balance = await instance.balanceOf(deployerAccount);

    expect(instance.transfer(recipientAccount, balance.add(new BN(1)))).to.eventually.be.rejected;
    expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balance);
  });
});
