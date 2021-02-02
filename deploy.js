const fs = require('fs')
const chalk = require('chalk')
const { ethers } = require('hardhat')

async function deploy(name, _args, _opts) {
  const args = _args || []
  const opts = _opts || {}

  console.log(`🍁 Deploying ${name}`)
  const contractArtifacts = await ethers.getContractFactory(name, opts)
  const contract = await contractArtifacts.deploy(...args)
  console.log(
    '  ',
    chalk.cyan(name),
    'deployed to:',
    chalk.greenBright(contract.address),
  )
  fs.writeFileSync(`artifacts/${name}.address`, contract.address)

  return contract
}

module.exports = deploy
