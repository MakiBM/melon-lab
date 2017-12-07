// @flow
import getFundContract from "../contracts/getFundContract";
import type { Address } from "../../assets/schemas/Address";

/**
 * General fund informations
 */
type FundInformations = {
  fundAddress: Address,
  name: string,
  decimals: number,
  inception: Date,
};

/**
 * Get general fund informations for fund at `fundAddress`
 */
const getFundInformations = async (
  fundAddress: Address,
): Promise<FundInformations> => {
  const fundContract = getFundContract(fundAddress);
  const name = await fundContract.instance.getName.call();
  const decimals = (await fundContract.instance.getDecimals.call()).toNumber();
  const inception = await fundContract.instance.getCreationTime.call();

  return {
    fundAddress,
    name,
    decimals,
    inception: new Date(inception.times(1000).toNumber()),
  };
};

export default getFundInformations;
