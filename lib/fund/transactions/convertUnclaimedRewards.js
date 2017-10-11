// @flow
import setup from "../../utils/setup";
import gasBoost from "../../utils/gasBoost";
import getFundContract from "../contracts/getFundContract";
import ensure from "../../utils/ensure";
import findEventInLog from "../../utils/findEventInLog";

/* @post: returns string ERR or {timestamp, shareQuentity, unclaimedRewards} */

const convertUnclaimedRewards = async (
  fundAddress: string,
  from: string = setup.web3.eth.defaultAccount,
) => {
  const fundContract = await getFundContract(fundAddress);
  const owner = await fundContract.owner();
  ensure(owner === from, "Not owner of fund");

  const receipt = await gasBoost(fundContract.convertUnclaimedRewards, [], {
    from,
  });

  const updateLog = findEventInLog("RewardsConverted", receipt);
  const rewardsConverted = updateLog.args;
  return rewardsConverted;
};

export default convertUnclaimedRewards;
