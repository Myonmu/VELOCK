pragma solidity ^0.5.0;

contract Mileage {
    struct MileageEntry{
        uint mileageValue;
        uint timestamp;
    }

    mapping(address=>MileageEntry[]) public mileageEntries;
    //*
    mapping(bytes32 => address) public mappedVinToKeyEntries;
    mapping(address => bytes32) public reverse;
    address public owner = msg.sender;
    function storeMileage(uint mileage, uint timestamp) public returns(address){
        address payable vehicleIdentity = msg.sender;
        mileageEntries[vehicleIdentity].push(MileageEntry({
        mileageValue: mileage,
        timestamp: timestamp
    }));
        return vehicleIdentity;
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
    function mapVinToPublicKey(bytes32 hashedVin, address publicKey)public
    returns (string memory){
        if(mappedVinToKeyEntries[hashedVin] == address(0x0)
        && reverse[publicKey]  == ""){
            mappedVinToKeyEntries[hashedVin] = publicKey;
            reverse[publicKey]=hashedVin;
            return ("OK");
        }
        return ("FAILED");
    }

    //unbind de Vin with the public key(the address)
    function resetVinMapping(bytes32 hashedVin, address addr)public
    returns (string memory){
        if(msg.sender==owner) {
        mappedVinToKeyEntries[hashedVin] = address(0x0);
        reverse[addr] = "";
        return ("OK");
        }
        return ("FAILED");
    }

    function getAddress(bytes32 hashedVin) public view returns(address){

        return mappedVinToKeyEntries[hashedVin];
    }

}








