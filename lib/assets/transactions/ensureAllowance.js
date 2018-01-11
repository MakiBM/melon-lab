// @flow
import BigNumber from "bignumber.js";
import getAllowance from "../calls/getAllowance";
import approve from "../transactions/approve";

import type { Address } from "../schemas/Address";
import type { TokenSymbol } from "../schemas/TokenSymbol";

/**
 * Ensures that `spender` still has the allowance to spend `quantity` of tokens
 * with `sympol` of `owner`. If current allowance is below requested allowance,
 * only the difference is approved again.
 *
 * @returns the actual approved quantity
 */
const ensureAllowance = async (
  wallet,
  symbol: TokenSymbol,
  owner: Address,
  spender: Address,
  quantity: BigNumber,
): Promise<BigNumber> => {
  const current = await getAllowance(symbol, owner, spender);
  const missing: BigNumber = quantity.minus(current);
  const approved: boolean = await approve(
    symbol,
    spender,
    missing,
    wallet,
    {},
    owner,
  );
  return approved ? missing : new BigNumber(0);
};

export default ensureAllowance;
