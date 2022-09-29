const { deployments, ethers } = require("hardhat")
const { assert, expect } = require("chai")
// const { developmentChains } = require("../../helper-hardhat-config")
const nullAddress = "0x0000000000000000000000000000000000000000"
const transferValue = 10
const allowedValue = 20

describe("ERC20", async function () {
    let ERC20, deployer
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        ERC20 = await ethers.getContract("ERC20", deployer)  // get the most recent deployed contract
    })

    describe("constructor", function () {
        it("sets the token name correctly", async () => {
            const response = await ERC20.name()
            assert.equal(response, "BaseToken")
        })
    })
    
    describe("transfer", async function () {
        it("Fails if transfer to 0x address", async function () {
            await expect(ERC20.transfer(nullAddress, transferValue)).to.be.revertedWith(
                "ERC20: transfer to the zero address"
            )
        })
        it("Fails if transfer amount exceeds balance", async function () {
            const accounts = await ethers.getSigners()
            const balanceSender = await ERC20.balanceOf(accounts[0].address)
            await expect(ERC20.transfer(accounts[1].address,balanceSender+1)).to.be.revertedWith(
                "ERC20: transfer amount exceeds balance"
            )
        })
        it("Transfer amount changes sender and receiver balances", async function () {
            const accounts = await ethers.getSigners()
            const startingBalanceSender = await ERC20.balanceOf(accounts[0].address)
            const startingBalanceReceiver = await ERC20.balanceOf(accounts[1].address)
            console.log("starting balance sender:" + startingBalanceSender)
            console.log("starting balance receiver:" + startingBalanceReceiver)
            await ERC20.transfer(accounts[1].address, transferValue)
            const responseSender = await ERC20.balanceOf(accounts[0].address)
            const responseReceiver = await ERC20.balanceOf(accounts[1].address)
            const endingBalanceSender = startingBalanceSender-transferValue
            const endingBalanceReceiver = startingBalanceReceiver+transferValue
            console.log("Ending balance sender:" + endingBalanceSender)
            console.log("Ending balance receiver:" + endingBalanceReceiver)
            assert.equal(responseSender, endingBalanceSender)
            assert.equal(responseReceiver, Number(endingBalanceReceiver))
        })
    })

    describe("approve", async function () {
        it("Approve changes allowance", async function () {
            const accounts = await ethers.getSigners()
            const startingAllowance = await ERC20.allowance(accounts[0].address, accounts[1].address)
            console.log("Starting allowance: " + startingAllowance)
            await ERC20.approve(accounts[1].address, allowedValue)
            const responseAllowance = await ERC20.allowance(accounts[0].address, accounts[1].address)
            const endingAllowance = startingAllowance+allowedValue
            console.log("Ending allowance: " + endingAllowance)
            assert.equal(responseAllowance, Number(endingAllowance))
        })
    })

    describe("transferFrom", async function () {
        it("Fails if transferFrom amount exceeds allowance", async function () {
            const accounts = await ethers.getSigners()
            await ERC20.approve(accounts[1].address, allowedValue)
            const allowance = await ERC20.allowance(
                accounts[0].address,
                accounts[1].address)
            const ERC20ConnectedContract = await ERC20.connect(accounts[1])
            await expect(ERC20ConnectedContract.transferFrom(
                accounts[0].address,
                accounts[1].address,
                allowance+1
            )).to.be.revertedWith("ERC20: insufficient allowance")
        })
        it("TransferFrom changes allowance", async function () {
            const accounts = await ethers.getSigners()
            await ERC20.approve(
                accounts[1].address,
                allowedValue)
            const startingAllowance = await ERC20.allowance(
                accounts[0].address,
                accounts[1].address)
            const ERC20ConnectedContract = await ERC20.connect(accounts[1])
            await ERC20ConnectedContract.transferFrom(
                accounts[0].address,
                accounts[1].address,
                transferValue)
            const endingAllowance = startingAllowance-transferValue
            const responseAllowance = await ERC20.allowance(
                accounts[0].address, accounts[1].address)
            assert.equal(responseAllowance, Number(endingAllowance))
        })
        it("TransferFrom changes sender et receiver balances", async function () {
            const accounts = await ethers.getSigners()
            await ERC20.approve(
                accounts[1].address,
                allowedValue)
            const startingAllowance = await ERC20.allowance(
                accounts[0].address,
                accounts[1].address)
            const ERC20ConnectedContract = await ERC20.connect(accounts[1])
            await ERC20ConnectedContract.transferFrom(
                accounts[0].address,
                accounts[1].address,
                transferValue)
            const endingAllowance = startingAllowance-transferValue
            const responseAllowance = await ERC20.allowance(
                accounts[0].address, accounts[1].address)
            assert.equal(responseAllowance, Number(endingAllowance))
        })
    })
})