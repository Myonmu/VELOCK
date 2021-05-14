pragma solidity ^0.5.0;
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Mileage.sol";
contract TestMileage {
    Mileage mileage = Mileage(DeployedAddresses.Mileage());
    uint expectedMileage = 1000;
    uint expectedMileage1 = 2000;
    uint expectedTimestamp = 10123456;
    uint expectedTimestamp1 = 40123456;
    address expectedAddress = address(this);

    function testMileage() public{
        mileage.storeMileage(expectedMileage,expectedTimestamp);
        mileage.storeMileage(expectedMileage1,expectedTimestamp1);
        (uint[] memory rtm,uint[] memory rtt) = mileage.getMileageByAddress(expectedAddress);
        uint rtMileage = rtm[0];
        uint rtMileage1 = rtm[1];
        uint rtTimestamp = rtt[0];
        uint rtTimestamp1 = rtt[1];
        Assert.equal(expectedTimestamp,rtTimestamp,"Timestamp 1 not match");
        Assert.equal(expectedMileage,rtMileage,"Mileage 1 not match");
        Assert.equal(expectedTimestamp1,rtTimestamp1,"Timestamp 2 not match");
        Assert.equal(expectedMileage1,rtMileage1,"Mileage 2 not match");
    }
}
