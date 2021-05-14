pragma solidity ^0.5.0;
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {

    Adoption adoption = Adoption(DeployedAddresses.Adoption());
    uint expectedPetId = 8;
    address expectedAdopter = address(this);
    function testAdoptable() public{
        uint returnedId = adoption.adopt(expectedPetId);
        Assert.equal(returnedId,expectedPetId,"not match");

    }
    function testGetAdopterByPet() public{
        address adopter = adoption.adopters(expectedPetId);
        Assert.equal(adopter,expectedAdopter,"not match");
    }

    function testGetAdopterAddressByPetIdInArray() public {
        // Store adopters in memory rather than contract's storage
        address[16] memory adopters = adoption.getAdopters();
        Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner of the expected pet should be this contract");
    }
}
