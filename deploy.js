const fs = require('fs')
const chalk = require('chalk')
const { ethers } = require('hardhat')

async function deploy(name, _args) {
  const args = _args || []

  console.log(`🍁 Deploying ${name}`)
  const contractArtifacts = await ethers.getContractFactory(name)
  const contract = await contractArtifacts.deploy(...args)
  console.log(
    '  ',
    chalk.cyan(name),
    'deployed to:',
    chalk.magenta(contract.address),
  )
  fs.writeFileSync(`artifacts/${name}.address`, contract.address)

  return contract
}

module.exports = deploy
