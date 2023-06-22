import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import verify from "../utils/verify"
// @ts-ignore
import { ethers } from "hardhat"

const deployGovernanceToken:DeployFunction = async function(hre:HardhatRuntimeEnvironment){
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  console.log("Deploying Governance Token...");

  const governanceToken = await deploy("GovernanceToken",{
    from:deployer,
    args:[],
    log:true,
    waitConfirmations:networkConfig[network.name].blockConfirmations || 1,
  })
  log(`GovernanceToken at ${governanceToken.address}`)
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(governanceToken.address, [])
  }
  await delegate(governanceToken.address,deployer);
  console.log("Delegated!");
  
}

const delegate =  async (governanceTokenAddress:string,delegateAccount:string)=> {
    const governanceToken = await ethers.getContractAt("GovernanceToken",governanceTokenAddress)
    const tx = await governanceToken.delegate(delegateAccount)
    await tx.wait(1)
    console.log(`Checkpoints ${await governanceToken.numCheckpoints(delegateAccount)}`);
    
  }

export default deployGovernanceToken;
deployGovernanceToken.tags = ["all", "deployGovernanceToken"]