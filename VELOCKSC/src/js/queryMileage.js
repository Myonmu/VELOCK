App = {
    web3Provider: null,
    contracts: {},
    chart: null,

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
    },

    updater: function (msg) {
        $("#data").append("<div class='entry'>" + msg + "</div>");
    },

    bindEvent: function () {
        $('#submit').click(function () {
            $(".entry").remove();
            App.retrieveDataWithVIN($('#addr').val().toString())
        });
    },

    retrieveDataWithVIN: function (vin) {

        //TODO add hashing
        return App.retrieveData(vin);
    },

    retrieveData: function (vin) {
        var mileage;
        var timestamp;
        var mileageInstance;
        var combinedData = [];
        var address;
        web3.eth.getAccounts(function (error, accounts) {
            $("table-content").empty();
            if (error) {
                console.log(error);
            }
            App.contracts.Mileage.deployed().then(function (instance) {
                mileageInstance = instance;
                mileageInstance.getAddress.call(vin)
                    .then(function (addr) {
                        address = addr;
                        //App.updater(address);
                        return mileageInstance.getEntryCount.call(address)
                    })
                    .then(function (count) {
                        var i = 0;
                        while (i < count) {
                            $("#table-content").append("<tr class='entry' id='entry" + i + "'></tr>");
                            $('#entry' + i).append("<th scope='row'>" + i + "</th>");
                            i++;
                        }
                    }).then(function () {
                    return mileageInstance.getMileageArray.call(address)
                })
                    .then(function (mil) {
                        mileage = mil;
                        var i = 0;
                        while (i < mil.length) {
                            $('#entry' + i).append("<td>" + mil[i].toString() + "</td>");
                            i++;
                        }
                    }).then(function () {
                    return mileageInstance.getTimestampArray.call(address)
                })
                    .then(function (stmp) {
                        timestamp = stmp;
                        var i = 0;
                        while (i < stmp.length) {
                            var s = stmp[i];
                            var d = new Date(0);
                            d.setUTCMilliseconds(s);
                            $('#entry' + i).append("<td>" + d + "</td>");
                            i++;
                        }
                    }).then(function () {
                    var i = 0;
                    while (i < mileage.length) {
                        combinedData.push({x: timestamp[i].toString(), y: mileage[i].toString()});
                        i++;
                    }
                }).then(function () {
                    if (App.chart != null) {
                        App.chart.destroy();
                    }
                    var myChartConfig = {
                        type: 'scatter',
                        data: {
                            datasets: [{
                                label: 'Mileage',
                                data: combinedData
                            }]
                        },
                        options: {
                            scales: {
                                x: {
                                    type: 'linear',
                                    position: 'bottom'
                                }
                            },
                            pointBackgroundColor: '#d91e56',
                            showLine: true
                        }
                    }
                    App.chart = new Chart(
                        document.getElementById('myChart'),
                        myChartConfig
                    );
                }).catch(function (err) {
                    App.updater(err.message);
                    console.log(err.message);
                });
            });
        });
    }
}

$(function () {
    $(window).load(function () {
        App.init();
        App.bindEvent();
    });
});