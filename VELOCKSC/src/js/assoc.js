App = {
    web3Provider: null,
    contracts: {},

    init: async function () {
        return await App.initWeb3();
    },

    initWeb3: async function () {

        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('Mileage.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with @truffle/contract
            App.contracts.Mileage = TruffleContract(data);
            // Set the provider for our contract
            App.contracts.Mileage.setProvider(App.web3Provider);
        });
        return App.bindEvent();
    },

    bindEvent: function () {
        $('#bind').click(function () {
            var vin = $('#vin').val().toString();
            var addr = $('#addr').val().toString();

            App.handleCommit(vin, addr);
        });
    },

    handleCommit: function (vin, addr) {

        var mileageInstance;
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[9];

            App.contracts.Mileage.deployed().then(function (instance) {
                mileageInstance = instance;
                return mileageInstance.mapVinToPublicKey(vin, addr, {from: account});
            }).then(function(r){App.updater("Done.");}).catch(function (err) {
                App.updater(err.message);
            });
        });
    },

    updater: function (msg) {
        $("#data").html(msg);
    }

};

//Main body of the script
App.init();