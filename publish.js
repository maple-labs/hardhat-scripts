const fs = require('fs')
const chalk = require('chalk')
const bre = require('hardhat')

function publishContract(contractName, directory) {
  let contract = fs
    .readFileSync(
      `${bre.config.paths.artifacts}/contracts/${contractName}.sol/${contractName}.json`,
    )
    .toString()

  const addressFile = `${bre.config.paths.artifacts}/${contractName}.address`

  if (fs.existsSync(addressFile)) {
    const address = fs.readFileSync(addressFile).toString()
    contract = JSON.parse(contract)
    fs.writeFileSync(
      `${directory}/${contractName}.address.js`,
      `module.exports = "${address}";`,
    )
  }

  fs.writeFileSync(
    `${directory}/${contractName}.abi.js`,
    `module.exports = ${JSON.stringify(contract.abi, null, 2)};`,
  )
  fs.writeFileSync(
    `${directory}/${contractName}.bytecode.js`,
    `module.exports = "${contract.bytecode}";`,
  )

  return true
}

async function publish(directories) {
  try {
    for (let i = 0; i < directories.length; i++) {
      if (!fs.existsSync(directories[i])) {
        fs.mkdirSync(directories[i])
      }
      console.log('📚 Publishing', 'to', chalk.yellow(directories[i]))
      const finalContractList = []
      fs.readdirSync(bre.config.paths.sources).forEach((file) => {
        if (file.indexOf('.sol') >= 0) {
          const contractName = file.replace('.sol', '')
          // Add contract to list if publishing is successful
          try {
            if (publishContract(contractName, directories[i])) {
              finalContractList.push(contractName)
            }
          } catch (e) {
            console.log(e)
          }
        }
      })
      fs.writeFileSync(
        `${directories[i]}/contracts.js`,
        `module.exports = ${JSON.stringify(finalContractList)};`,
      )
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = publish
