const ContractName = artifacts.require("ContractName");

module.exports = async function (deployer) {
  await deployer.deploy(ContractName);
};