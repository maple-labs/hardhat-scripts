const fs = require('fs')
const chalk = require('chalk')
const bre = require('hardhat')

async function publishContract(contractName, directory) {
  const contractFilePath =
    `${bre.config.paths.artifacts}/contracts/` +
    `${contractName}.sol/${contractName}.json`
  const contract = await require(contractFilePath)
  const networkFolder = directory + '/' + bre.network.name

  if (!fs.existsSync(networkFolder)) {
    fs.mkdir(networkFolder, console.log)
  }

  const props = {
    contract,
    contractName,
    networkFolder,
    directory,
    networkFile,
  }

  return Promise.all([
    createAddressFile(props),
    createAbiFile(props),
    createByteCodeFile(props),
    createRawJsonFile(props),
  ])
}

async function createRawJsonFile({ contract, contractName, networkFolder }) {
  if (!fs.existsSync(`${networkFolder}/json`)) {
    fs.mkdir(`${networkFolder}/json`, console.log)
  }

  fs.writeFileSync(
    `${networkFolder}/json/${contractName}.abi.json`,
    JSON.stringify(contract.abi),
    console.log,
  )
}

async function createAddressFile({ contractName, networkFolder, networkFile }) {
  if (!fs.existsSync(`${networkFolder}/addresses`)) {
    fs.mkdir(`${networkFolder}/addresses`, console.log)
  }

  const addressFile = `${bre.config.paths.artifacts}/${contractName}.address`

  if (fs.existsSync(addressFile)) {
    const address = fs.readFileSync(addressFile).toString()

    fs.writeFileSync(
      `${networkFolder}/addresses/${contractName}.address.js`,
      `module.exports = "${address}";`,
    )

    const abiIndex = require(networkFile)
  }
}

async function createAbiFile({
  contract,
  contractName,
  networkFolder,
  networkFile,
}) {
  if (!fs.existsSync(`${networkFolder}/abis`)) {
    fs.mkdir(`${networkFolder}/abis`, (err, data) => null)
  }

  const abi = JSON.stringify(contract.abi, null, 2)
  const abiFileName = `${networkFolder}/abis/${contractName}.abi.js`

  if (!fs.existsSync(networkFile)) {
    fs.writeFile(networkFile, '', console.log)
  }

  fs.writeFileSync(abiFileName, `module.exports = ${abi};`, console.log)

  const abiIndex = require(networkFile)

  if (!(`${contractName}Abi` in abiIndex)) {
    const newExport =
      `module.exports.${contractName}Abi ` +
      `= require('./${bre.network.name}/abis/${contractName}.abi.js');\n`
    fs.appendFileSync(networkFile, newExport)
  }
}

async function createByteCodeFile({
  contract,
  contractName,
  networkFolder,
  networkFile,
}) {
  if (!fs.existsSync(`${networkFolder}/bytecode`)) {
    await fs.mkdir(`${networkFolder}/bytecode`, console.log)
  }

  fs.writeFileSync(
    `${networkFolder}/bytecode/${contractName}.bytecode.js`,
    `module.exports = "${contract.bytecode}";`,
  )

  const abiIndex = require(networkFile)

  if (!(`${contractName}ByteCode` in abiIndex)) {
    const newExport =
      `module.exports.${contractName}ByteCode` +
      ` = require('./${bre.network.name}/bytecode/${contractName}.bytecode.js');\n`
    fs.appendFileSync(networkFile, newExport)
  }
}

async function publish(directories) {
  try {
    for (let i = 0; i < directories.length; i++) {
      if (!fs.existsSync(directories[i])) {
        fs.mkdirSync(directories[i])
      }
      console.log('📚 Publishing', 'to', chalk.yellow(directories[i]), '\n')
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
