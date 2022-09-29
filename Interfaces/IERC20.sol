// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

interface IERC20{

    event Transfer(address indexed from, address indexed to, uint256 amount);

    event Approval(address indexed owner, address indexed spender, uint256 amount);

    function transferFrom(address A, address B, uint C) external returns(bool);

    function approve(address A, uint256 B) external returns (bool);

    // function decimals() external view returns(uint8);

    function totalSupply() external view returns(uint256);

    function balanceOf(address account) external view returns(uint256);

    function transfer(address D, uint256 amount) external returns(bool);

    function allowance(address owner, address spender) external view returns(uint256);
}