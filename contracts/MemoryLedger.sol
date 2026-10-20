// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Unaudited source. Deployment requires explicit review and approval.
interface IChogGenesis {
    function ownerOf(uint256 tokenId) external view returns (address);
}
/// @notice One permanent decision per Genesis token, inherited on transfer.
/// @dev Only the current owner may awaken; ERC721 approvals grant no rights here.
/// No admin, reset, payments or upgrade mechanism. awakenedBy is historical attribution.
contract MemoryLedger {
    IChogGenesis public immutable genesis;
    enum Choice { None, Reveal, Protect }
    struct Memory { Choice choice; address awakenedBy; uint64 at; }
    mapping(uint256 => Memory) private memories;
    error InvalidCollection();
    error NotOwner();
    error AlreadyAwakened();
    error BadChoice();
    event Awakened(uint256 indexed tokenId,address indexed owner,Choice choice);
    constructor(address collection){
        if (collection.code.length == 0) revert InvalidCollection();
        genesis = IChogGenesis(collection);
    }
    function awaken(uint256 tokenId,Choice choice) external {
        if(choice == Choice.None) revert BadChoice();
        if(genesis.ownerOf(tokenId)!=msg.sender) revert NotOwner();
        if(memories[tokenId].choice!=Choice.None) revert AlreadyAwakened();
        memories[tokenId]=Memory(choice,msg.sender,uint64(block.timestamp));
        emit Awakened(tokenId,msg.sender,choice);
    }
    function memoryOf(uint256 tokenId) external view returns(Memory memory){
        return memories[tokenId];
    }
}
