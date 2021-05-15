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

    function getMileageByAddress(address target) public view
    returns(uint[] memory, uint[] memory){
        uint[] memory mileage = new uint[](mileageEntries[target].length);
        uint[] memory timestamp = new uint[](mileageEntries[target].length);
        for(uint i = 0; i < mileageEntries[target].length;i++){
            MileageEntry storage entry = mileageEntries[target][i];
            mileage[i] = entry.mileageValue;
            timestamp[i] = entry.timestamp;
        }
        return (mileage,timestamp);
    }
}
