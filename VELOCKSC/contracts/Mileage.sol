pragma solidity ^0.5.0;

contract Mileage {
    struct MileageEntry{
        uint mileageValue;
        uint timestamp;
    }

    mapping(address=>MileageEntry[]) public mileageEntries;
    //*
    mapping(bytes32 => address) public mappedVinToKeyEntries;
    address owner;
    bytes32 Vin;
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

    function getMileageArray(address target) public view returns(uint[] memory){
        uint[] memory mileage = new uint[](mileageEntries[target].length);
        for(uint i = 0; i<mileageEntries[target].length;i++){
        MileageEntry storage entry = mileageEntries[target][i];
        mileage[i]=entry.mileageValue;
        }
        return mileage;
    }

    function getTimestampArray(address target) public view returns(uint[] memory){
        uint[] memory stamp = new uint[](mileageEntries[target].length);
        for(uint i = 0; i<mileageEntries[target].length;i++){
            MileageEntry storage entry = mileageEntries[target][i];
            stamp[i]=entry.timestamp;
        }
        return stamp;
    }

    //bind the Vin with the public key(the address)
    function mapVinToPublicKey(bytes32 hashedVin, address publicKey)public{
        require(mappedVinToKeyEntries[hashedVin] == address(0x0));
        //s'il n'y a pas de mapping d'existe,met mapping
        if(mappedVinToKeyEntries[hashedVin] == address(0x0)){
            mappedVinToKeyEntries[hashedVin] = publicKey;
        }
    }
    //unbind de Vin with the public key(the address)
    function resetVinMapping(bytes32 hashedVin)public view{
        require(owner == msg.sender);
        mappedVinToKeyEntries[hashedVin] == address(0x0);
    }
    //
    string Vin = "FRrenault123";

    function stringToBytes32(string memory source) view internal returns(bytes32 result){
        assembly{
            result := mload(add(source,32))
        }
    }

    function getVin() public view returns(bytes32 ){

        return stringToBytes32(Vin);
    }

}

    }





}
