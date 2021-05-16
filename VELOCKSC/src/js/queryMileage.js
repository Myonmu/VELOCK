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

    updater: function(msg){
        $("#data").append("<div class='entry'>"+msg+"</div>");
    },


    retrieveData: function(address) {
        var mileageInstance;
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }
            App.contracts.Mileage.deployed().then(function (instance) {
                mileageInstance = instance;
                mileageInstance.getEntryCount.call(address).then(function (count) {
                    var i = 0;
                    while (i < count) {
                        mileageInstance.getMileage.call(address, i).then(
                            function(mil){
                                //TODO Update mileage data here
                                App.updater(mil.toString());

                            }
                        );
                        mileageInstance.getTimestamp.call(address, i).then(
                            function(stamp){
                                //TODO Update timestamp data here
                                App.updater(stamp.toString());

                            }
                        );
                        i++;
                    }
                }).catch(function (err) {
                    App.updater(err.message);
                    console.log(err.message);
                });
            });
        });
    }
}

$(function() {
    $(window).load(function() {
        App.init();
        //TODO Replace with proper address
        App.retrieveData("0xe72bbFA84860363d8ba321F46f0443da72B7B5f0");

    });
});