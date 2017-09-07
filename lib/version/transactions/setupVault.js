import contract from "truffle-contract";
import ParticipationJson from "@melonproject/protocol/build/contracts/Participation.json";
import RMMakeOrdersJson from "@melonproject/protocol/build/contracts/RMMakeOrders.json";
import VersionJson from "@melonproject/protocol/build/contracts/Version.json";
import SphereJson from "@melonproject/protocol/build/contracts/Sphere.json";
import setup from "../../utils/setup";
import findEventInLog from "../../utils/findEventInLog";

const setupVault = async (portfolioName, from = setup.defaultAccount) => {
  const portfolioSymbol = "MLN-T";
  const portfolioDecimals = 18;
  const participation = ParticipationJson.networks[setup.networkId].address;
  const riskManagement = RMMakeOrdersJson.networks[setup.networkId].address;
  const sphere = SphereJson.networks[setup.networkId].address;

  const Version = contract(VersionJson);
  Version.setProvider(setup.currentProvider);
  const versionContract = await Version.deployed();

  const args = [
    portfolioName,
    portfolioSymbol,
    portfolioDecimals,
    participation,
    riskManagement,
    sphere,
  ];

  /* TODO check why gasEstimation does not work: Failed: Transaction execution error. */
  const gasEstimation = await versionContract.setupVault.estimateGas(...args);
  args.push({ from, gas: Math.ceil(gasEstimation * 1.2) });

  const receipt = await versionContract.setupVault(...args);

  const vaultAddedMessage = findEventInLog("VaultAdded", receipt);
  const logArgs = vaultAddedMessage.args;

  return {
    id: logArgs.id.toNumber(),
    address: logArgs.vaultAddress,
    name: logArgs.name,
    timestamp: new Date(logArgs.atTime.times(1000).toNumber()),
  };
};

export default setupVault;
