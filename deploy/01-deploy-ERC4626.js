const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    // const chainId = network.config.chainId

    log("----------------------------------------------------")
    log("Deploying ERC20.sol and waiting for confirmations...")
    const argsERC20 = ["BaseToken", "BTK", 100]
    const Erc20 = await deploy("ERC20", {
        from: deployer,
        args: argsERC20,
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`ERC20.sol deployed at ${Erc20.address}`)

    log("----------------------------------------------------")
    log("Deploying ERC4626.sol and waiting for confirmations...")
    const argsERC4626 = [Erc20.address, "ShareToken", "STK"]
    const Erc4626 = await deploy("ERC4626", {
        from: deployer,
        args: argsERC4626,    
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`ERC4626.sol deployed at ${Erc4626.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(Erc20.address, argsERC20)
        await verify(Erc4626.address, argsERC4626)
    }
}

module.exports.tags = ["all", "erc20", "erc4626"]