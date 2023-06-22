import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { networkConfig } from "../helper-hardhat-config"
// @ts-ignore
import { ethers } from "hardhat"

const deployBox:DeployFunction =async (hre:HardhatRuntimeEnvironment) => {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log,get } = deployments
    const { deployer } = await getNamedAccounts()
    console.log("Deploying  box...");
    const box = await deploy("Box",{
        from:deployer,
        args:[],
        log:true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })

    const timeLock = await ethers.getContract("TimeLock")
    const boxContract = await ethers.getContractAt("Box",box.address)
    const transferOwnerTx = await boxContract.transferOwnership(timeLock.address)
    await transferOwnerTx.wait(1)
    console.log("DONE IT!!!!!!");
    
}
export default deployBox
deployBox.tags = ["all", "box"]