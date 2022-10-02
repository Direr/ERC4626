//SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "./ERC4626.sol";

contract Rebalancer {

  ERC20 public immutable asset;
  // ERC4626 private immutable _longPool;
  // ERC4626 private immutable _shortPool; 
  address public longPool;
  address public shortPool;
  address public owner;

  constructor(ERC20 _asset) {
    asset = _asset;
    owner = msg.sender;
  }

  function assetAdress() public view  returns (address) {
      return address(asset);
  }

  function longPoolAddress() public view  returns (address) {
      return longPool;
  }

  function shortPoolAddress() public view  returns (address) {
      return shortPool;
  }

  // function totalAssetsLongPool() public view returns (uint256) {
  //   return _longPool.totalAssets();
  // }

  // function totalAssetsShortPool() public view returns (uint256) {
  //   return _shortPool.totalAssets();
  // }

  modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

  /**
   * @notice Sets or resets the address of the long and short pools
   * @dev Only callable by the contract owner (onlyOwner to be implemented)
   * @dev emits xxx when the addressses are successfuly changed (tbi)
   */
  function setPoolAddresses(
    address _longPool,
    address _shortPool
    ) public onlyOwner {
      require(_longPool != address(0), "cannot be 0 address");
      require(_shortPool != address(0), "cannot be 0 address");
      // address oldLongPool = longPool;
      // address oldShortPool = longPool;
      longPool = _longPool;
      shortPool = _shortPool;
      // emit setLongPoolAddresses(oldLongPoolAddress, _longPoolAddress);
      // emit setShortPoolAddresses(oldShortPoolAddress, _shortPoolAddress);
  }

  function rebalance() public {

  }

}