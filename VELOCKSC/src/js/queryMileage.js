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

    bindEvent: function(){
        $('#submit').click(function(){$(".entry").remove();
            App.retrieveData($('#addr').val().toString())});
    },

    retrieveData: function(address) {

        var mileageInstance;
        web3.eth.getAccounts(function (error, accounts) {
            $("table-content").empty();
            if (error) {
                console.log(error);
            }
            App.contracts.Mileage.deployed().then(function (instance) {
                mileageInstance = instance;
                mileageInstance.getEntryCount.call(address).then(function (count) {
                    var i = 0;
                    while (i < count) {
                        $("#table-content").append("<tr class='entry' id='entry" + i + "'></tr>");
                        $('#entry' + i).append("<th scope='row'>" + i + "</th>");
                        i++;
                    }
                }).then(function(){return mileageInstance.getMileageArray.call(address)})
                    .then(function(mil){
                        var i = 0;
                        while (i<mil.length){
                            $('#entry' + i).append("<td>"+mil[i].toString()+"</td>");
                            i++;
                        }
                    }).then(function(){return mileageInstance.getTimestampArray.call(address)})
                    .then(function(stmp){
                        var i = 0;
                        while (i<stmp.length){
                            $('#entry' + i).append("<td>"+stmp[i].toString()+"</td>");
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
        App.bindEvent();
        //TODO Replace with proper address
        //App.retrieveData("0xbCC11D2Ae766E521A0d8D8Eab62c8e7CF8CD4b2b");

    });
});