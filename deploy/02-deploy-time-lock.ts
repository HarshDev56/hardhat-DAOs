import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { MIN_DELAY } from "../helper-hardhat-config"
import { networkConfig } from "../helper-hardhat-config"
import { developmentChains } from "../helper-hardhat-config"
import verify from "../utils/verify"


const deployTimeLock:DeployFunction = async function(hre:HardhatRuntimeEnvironment){
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    console.log("Deploying TimeLock...");
    const timeLock = await deploy("TimeLock",{
        from:deployer,
        args:[MIN_DELAY,[],[],deployer],
        log:true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`TimeLock at ${timeLock.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
      await verify(timeLock.address, [MIN_DELAY,[],[],deployer])
    }
  }
  
  export default deployTimeLock
  deployTimeLock.tags = ["all", "timelock"]