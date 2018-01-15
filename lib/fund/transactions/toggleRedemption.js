// @flow
import setup from "../../utils/setup";
import sendTransaction from "../../utils/parity/sendTransaction";
import getFundContract from "../contracts/getFundContract";
import ensure from "../../utils/generic/ensure";

import type { Address } from "../../assets/schemas/Address";

/**
 * Toggles redemption of fund at `fundAddress`
 */
const toggleRedemption = async (
  wallet,
  fundAddress: Address,
): Promise<boolean> => {
  const fundContract = await getFundContract(fundAddress);
  const owner = await fundContract.instance.owner.call();
  ensure(
    owner.toLowerCase() === wallet.address.toLowerCase(),
    "Not owner of fund",
  );

  const preRedemptionAllowed = await fundContract.instance.isRedeemAllowed.call();

  if (preRedemptionAllowed === true) {
    await sendTransaction(fundContract, "disableRedemption", [], wallet);
  } else if (preRedemptionAllowed === false) {
    await sendTransaction(fundContract, "enableRedemption", [], wallet);
  }

  const postRedemptionAllowed = await fundContract.instance.isRedeemAllowed.call();

  ensure(
    preRedemptionAllowed !== postRedemptionAllowed,
    "Toggle redemption was not successful",
  );
  return postRedemptionAllowed;
};

export default toggleRedemption;
