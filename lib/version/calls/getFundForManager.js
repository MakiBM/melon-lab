import getVersionContract from "../contracts/getVersionContract";

const getFundForManager = async managerAddress => {
  const versionContract = await getVersionContract();
  const vaultAddress = await versionContract.fundForManager(managerAddress);

  if (vaultAddress === "0x0000000000000000000000000000000000000000")
    return false;
  return vaultAddress;
};

export default getFundForManager;
