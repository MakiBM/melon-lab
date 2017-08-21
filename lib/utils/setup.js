const setup = {
  init({ web3, daemonAddress }) {
    this.web3 = web3;
    this.currentProvider = web3.currentProvider;
    this.defaultAccount = web3.eth.defaultAccount || web3.eth.accounts[0];
    this.daemonAddress = daemonAddress;
  },
};

export default setup;
