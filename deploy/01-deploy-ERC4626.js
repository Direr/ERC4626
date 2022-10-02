const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log , execute} = deployments
    const { deployer } = await getNamedAccounts()
    // const chainId = network.config.chainId

    log("----------------------------------------------------")
    log("Deploying ERC20.sol and waiting for confirmations...")
    const argsERC20 = ["BaseToken", "BTK", 100]
    const Erc20 = await deploy("ERC20", {
        from: deployer,
        args: argsERC20,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`ERC20.sol deployed at ${Erc20.address}`)

    log("----------------------------------------------------")
    log("Deploying Rebalancer.sol and waiting for confirmations...")
    const rebalancer = await deploy("Rebalancer", {
        from: deployer,
        args: [Erc20.address],    
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`Rebalancer.sol deployed at ${rebalancer.address}`)

    log("----------------------------------------------------")
    log("Deploying ERC4626Long.sol and waiting for confirmations...")
    const argsERC4626Long = [
        "ShareTokenLong",
        "STL",
        Erc20.address,
        rebalancer.address,
    ]
    const Erc4626Long = await deploy("ERC4626", {
        from: deployer,
        args: argsERC4626Long,    
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`ERC4626.sol (long) deployed at ${Erc4626Long.address}`)

    log("----------------------------------------------------")
    log("Deploying ERC4626Short.sol and waiting for confirmations...")
    const argsERC4626Short = [
        "ShareTokenShort",
        "STS",
        Erc20.address,
        rebalancer.address,
    ]
    const Erc4626Short = await deploy("ERC4626", {
        from: deployer,
        args: argsERC4626Short,    
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`ERC4626.sol (short) deployed at ${Erc4626Short.address}`)

    // sets short and long pool adresses in Rebalancer
    await execute("Rebalancer", {
        from: deployer,
        log: true,
    },
    "setPoolAddresses",
    Erc4626Long.address,
    Erc4626Short.address
    )

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(Erc20.address, argsERC20)
        await verify(Erc4626Long.address, argsERC4626Long)
        await verify(Erc4626Short.address, argsERC4626Short)
    }
}

module.exports.tags = ["all", "erc20", "erc4626"]


// sets short pool address in long pool contract
    // await execute("Erc4626Long",
    // {
    //     from: deployer,
    //     log: true,
    // },
    // "setOppositePoolAddress",
    // Erc4626Short.address
    // )

    // // sets long pool address in short pool contract
    // await execute("ERC4626Short", {
    //     from: deployer,
    //     log: true,
    // },
    // "setOppositePoolAddress",
    // Erc4626Long.address
    // )