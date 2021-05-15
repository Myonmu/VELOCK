App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Mileage.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      App.contracts.Mileage = TruffleContract(data);
      // Set the provider for our contract
      App.contracts.Mileage.setProvider(App.web3Provider);
    });

  },

  handleCommit: function(mileage,timestamp) {
    var mileageInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Mileage.deployed().then(function(instance) {
        mileageInstance = instance;
        var add = mileageInstance.storeMileage(mileage,timestamp, {from: account});
        console.log(add);
        return add;
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

App.init().then(function(){
    App.handleCommit(1000,1023456);
});

