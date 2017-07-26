// @flow
import BigNumber from "bignumber.js";

import { getTokenAddress, getTokenPrecisionByAddress } from "../../utils/specs";

const removePrecision = (quantity: BigNumber, symbol: String) => {
  const tokenAddress = getTokenAddress(symbol);
  const precision = getTokenPrecisionByAddress(tokenAddress);
  return quantity.times(10 ** precision);
};

export default removePrecision;
