const { deployments, ethers } = require("hardhat")
const { assert } = require("chai")
const assetDeposit = 10
const allowedValue = 50

describe("Rebalancer", async function () {
    let Rebalancer, deployer
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        ERC20 = await ethers.getContract("erc20", deployer)
        ERC4626Long = await ethers.getContract("ERC4626Long", deployer)
        ERC4626Short = await ethers.getContract("ERC4626Short", deployer)
        Rebalancer = await ethers.getContract("Rebalancer", deployer)
    })

    describe("Views", async function () {
        it("Views", async function () {
            const addressAsset = await Rebalancer.asset()
            console.log("Address asset: " + addressAsset)
            const addressLongPool = await Rebalancer.longPool()
            console.log("Address LongPool: " + addressLongPool)
            const addressShortPool = await Rebalancer.shortPool()
            console.log("Address ShortPool: " + addressShortPool)
            const totalAssetsLongPool = await Rebalancer.totalAssetsLongPool()
            console.log("totalAssetsLongPool: " + totalAssetsLongPool)
            const totalAssetsShortPool = await Rebalancer.totalAssetsShortPool()
            console.log("totalAssetsShortPool: " + totalAssetsShortPool)
        })

        it("Deposit changes caller ERC20 asset balance", async function () {
            const accounts = await ethers.getSigners()
            await ERC20.approve(ERC4626Long.address, allowedValue)
            console.log("Depositor approves Long: " + allowedValue)
            await ERC4626Long.deposit(assetDeposit, accounts[0].address)
            console.log("Depositor deposits " + assetDeposit)
        })
    })
})

