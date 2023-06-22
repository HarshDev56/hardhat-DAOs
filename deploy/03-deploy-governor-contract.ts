import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { QUORUM_PERCENTAGE, VOTING_DELAY, VOTING_PERIOD, developmentChains, networkConfig } from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployGovernorContract:DeployFunction = async function(hre:HardhatRuntimeEnvironment){
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log,get } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await get("GovernanceToken")
    const timeLock = await get("TimeLock")
    console.log("Deploying  Governor Contract...");
    const governorContract = await deploy("GovernorContract",{
        from:deployer,
        args:[
            governanceToken.address,
            timeLock.address,
            VOTING_DELAY,
            VOTING_PERIOD,
            QUORUM_PERCENTAGE
        ],
        log:true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,

    })
    log(`governorContract at ${governorContract.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
      await verify(governorContract.address, [
        governanceToken.address,
        timeLock.address,
        VOTING_DELAY,
        VOTING_PERIOD,
        QUORUM_PERCENTAGE
    ])
    }
} 
export default deployGovernorContract
deployGovernorContract.tags = ["all", "timelock"]