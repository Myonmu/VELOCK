pragma solidity ^0.5.0;

contract Mileage {
    struct MileageEntry{
        uint mileageValue;
        uint timestamp;
    }
    mapping(address=>MileageEntry[]) public mileageEntries;
    address owner;

    //function Mileage() public{
     //owner=msg.sender;
    //}
    function storeMileage(uint mileage, uint timestamp) public returns(address){
        address payable vehicleIdentity = msg.sender;
        mileageEntries[vehicleIdentity].push(MileageEntry({
        mileageValue: mileage,
        timestamp: timestamp
    }));
        return vehicleIdentity;
    }

    function getMileage(address target,uint index) public view
    returns(uint mileage){
        MileageEntry storage entry = mileageEntries[target][index];
        uint mileage = entry.mileageValue;
        return mileage;
    }

    function getTimestamp(address target,uint index) public view
    returns(uint timestamp){
        MileageEntry storage entry = mileageEntries[target][index];
        uint timestamp = entry.timestamp;
        return timestamp;
    }

    function getEntryCount(address target) public view
    returns(uint count){
        uint count = mileageEntries[target].length;
        return count;
    }
}
