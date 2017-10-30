// @flow
import BigNumber from "bignumber.js";
import getTokenContract from "../contracts/getTokenContract";
import toReadable from "../utils/toReadable";

/**
 * @returns the amount which spender is still allowed to withdraw from owner
 * @param tokenSymbol the symbol of the token. Example: "MLN-T"
 * @param ownerAddress holds the funds currently
 * @param spenderAddress is eligible to spend the funds
 */
const getAllowance: BigNumber = async (
  tokenSymbol: string,
  ownerAddress: string,
  spenderAddress: string,
) => {
  const tokenContract = await getTokenContract(tokenSymbol);
  const approvedAmount = await tokenContract.allowance(
    ownerAddress,
    spenderAddress,
  );

  return toReadable(approvedAmount, tokenSymbol);
};

export default getAllowance;
