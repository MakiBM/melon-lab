// @flow
import BigNumber from "bignumber.js";
import getFundContract from "../../fund/contracts/getFundContract";
import toReadable from "../../assets/utils/toReadable";

import type { Address } from "../../assets/schemas/Address";

/**
 * The participation of an investor in fund
 */
type Participation = {
  personalStake: BigNumber,
  totalSupply: BigNumber,
};

/**
 * Get the personalStake and totalSupply of an `investorAddress` in a fund at
 * fundAddress
 */
const getParticipation = async (
  fundAddress: Address,
  investorAddress: Address,
): Promise<Participation> => {
  const fundContract = await getFundContract(fundAddress);

  const personalStake = await fundContract.balanceOf(investorAddress);
  const totalSupply = await fundContract.totalSupply();

  return {
    personalStake: toReadable(personalStake),
    totalSupply: toReadable(totalSupply),
  };
};

export default getParticipation;
