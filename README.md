# Hardhat Scripts

Maple labs uses these deployment scripts for hardhat ethereum packages. These scripts were inspired by and made for <a href="https://github.com/austintgriffith/scaffold-eth">Scaffold Eth!</a>

## scripts/deploy.js

```javascript
const { deploy } = require("@maplelabs/hardhat-scripts");

async function main() {
  const bCreator = await deploy("MyContract", [param1, param2]);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## scripts/publish.js

```javascript
const { publish } = require("@maplelabs/hardhat-scripts");

async function main() {
  const directories = [
    "../web-app/src/contracts",
    "../contracts/src/contracts",
  ];
  publish(directories);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```
