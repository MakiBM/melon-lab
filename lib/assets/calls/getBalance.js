// @flow
import BigNumber from 'bignumber.js';
import getTokenContract from '../contracts/getTokenContract';
import toReadable from '../utils/toReadable';

import type { Address } from '../schemas/Address';
import type { TokenSymbol } from '../schemas/TokenSymbol';

/**
 * @returns the balance of a token for an address
 */
const getBalance = async (
  environment,
  { tokenSymbol, ofAddress },
): Promise<BigNumber> => {
  const tokenContract = await getTokenContract(environment, tokenSymbol);
  const result = await tokenContract.instance.balanceOf.call({}, [ofAddress]);
  return toReadable(result, tokenSymbol);
};

export default getBalance;
