const { deployments, ethers } = require("hardhat")
const { assert, expect } = require("chai")
const assetDeposit = 10
const allowedValue = 50
const transferValue = 20

describe("ERC4626", async function () {
    let ERC4626, deployer
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        ERC20 = await ethers.getContract("ERC20", deployer)  // get the most recent deployed contract
        ERC4626 = await ethers.getContract("ERC4626", deployer)  // get the most recent deployed contract
    })

    describe("deposit", async function () {
        
        it("Deposit changes caller ERC20 asset balance", async function () {
            const accounts = await ethers.getSigners()
            const assetBalanceA0T1 = await ERC20.balanceOf(accounts[0].address)
            console.log("First depositor asset before anything: " + (assetBalanceA0T1).toString())
            await ERC20.approve(ERC4626.address, allowedValue)
            console.log("First depositor approves " + allowedValue)
            await ERC4626.deposit(assetDeposit, accounts[0].address)
            console.log("First depositor deposits " + assetDeposit)
            const responseAssetBalance = await ERC20.balanceOf(accounts[0].address)
            console.log("First depositor asset AFTER deposit: " + (responseAssetBalance).toString())
            const assetBalanceA0T2 = assetBalanceA0T1-assetDeposit
            assert.equal(responseAssetBalance,assetBalanceA0T2)
        })

        it("Initial Deposit changes caller ERC4626 share balance correctly", async function () {
            const accounts = await ethers.getSigners()
            const shareBalanceA0T1 = await ERC4626.balanceOf(accounts[0].address)
            console.log("Fisrt depositor shares: " + (shareBalanceA0T1).toString())
            await ERC20.approve(ERC4626.address, allowedValue)
            console.log("First depositor approves " + allowedValue)
            await ERC4626.deposit(assetDeposit, accounts[0].address)
            console.log("First depositor deposits " + assetDeposit)
            const responseShareBalance = await ERC4626.balanceOf(accounts[0].address)
            console.log("First depositor shares AFTER deposit: " + (responseShareBalance).toString())
            const shareBalanceA0T2 = shareBalanceA0T1+assetDeposit
            assert.equal(responseShareBalance, Number(shareBalanceA0T2))
        })

        it("Second deposit changes caller ERC4626 share balance correctly", async function () {
            const accounts = await ethers.getSigners()
            const shareBalanceA0T1 = await ERC4626.balanceOf(accounts[0].address)
            console.log("Fisrt depositor shares: " + (shareBalanceA0T1).toString())
            await ERC20.approve(ERC4626.address, allowedValue)
            console.log("First depositor approves " + allowedValue)
            await ERC4626.deposit(assetDeposit, accounts[0].address)
            console.log("First depositor deposits " + assetDeposit)
            const assetBalanceA1T2 = await ERC20.balanceOf(accounts[1].address)
            console.log("Second depositor asset: " + (assetBalanceA1T2).toString())
            await ERC20.transfer(accounts[1].address, transferValue)
            console.log("First depositor transfers " + transferValue + " to second depositor")
            const ERC4626ConnectedContract = await ERC4626.connect(accounts[1])
            await ERC4626ConnectedContract.approve(ERC4626.address, allowedValue)
            console.log("Second depositor approves " + allowedValue)
            await ERC4626.deposit(assetDeposit, accounts[1].address)
            console.log("Second depositor deposits " + assetDeposit)
            const responseShareBalance = await ERC4626.balanceOf(accounts[1].address)
            console.log("Second depositor shares after deposit: " + (responseShareBalance).toString())
            

            // 
            // const endingShareBalance = startingShareBalance+assetDeposit
            // assert.equal(responseShareBalance, Number(endingShareBalance))
        })
    })
})