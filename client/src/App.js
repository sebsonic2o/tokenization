import React, { Component } from "react";
import KycContract from "./contracts/MyKYC.json";
import TokenContract from "./contracts/MyToken.json";
import SaleContract from "./contracts/MyTokenSale.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    loaded: false,
    kycAddress: "",
    tokenSaleAddress: "",
    userTokens: 0,
    tokenSymbol: "",
    tokenName: ""
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address
      );

      this.tokenInstance = new this.web3.eth.Contract(
        TokenContract.abi,
        TokenContract.networks[this.networkId] && TokenContract.networks[this.networkId].address
      );

      this.saleInstance = new this.web3.eth.Contract(
        SaleContract.abi,
        SaleContract.networks[this.networkId] && SaleContract.networks[this.networkId].address
      );

      let tokenSymbol = await this.tokenInstance.methods.symbol().call();
      let tokenName = await this.tokenInstance.methods.name().call();

      this.listenToTokenTransfer();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        loaded: true,
        tokenSaleAddress: this.saleInstance._address,
        tokenSymbol: tokenSymbol,
        tokenName: tokenName
      }, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateUserTokens = async () => {
    let userTokens = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({userTokens: userTokens});
  }

  listenToTokenTransfer = () => {
    this.tokenInstance.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  handleWhitelisting = async () => {
    const {kycAddress} = this.state;
    console.log(kycAddress, this.accounts[0]);
    let result = await this.kycInstance.methods.completeKYC(kycAddress).send({from: this.accounts[0]});
    console.log(result);
    alert("Address " + kycAddress + " has been whitelisted");
  };

  handleBuyToken = async () => {
    await this.saleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: this.web3.utils.toWei("1", "wei")});
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>{this.state.tokenName} Sale</h1>
        <p>Get your token today!</p>
        <h2>KYC Whitelisting</h2>
        Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange} />
        <button type="button" onClick={this.handleWhitelisting}>Whitelist</button>
        <h2>Buy {this.state.tokenSymbol} Tokens</h2>
        <p>Send ether to this address: {this.state.tokenSaleAddress}</p>
        <p>You have: {this.state.userTokens + " " + this.state.tokenSymbol}</p>
        <button type="button" onClick={this.handleBuyToken}>Buy more tokens</button>
      </div>
    );
  }
}

export default App;
