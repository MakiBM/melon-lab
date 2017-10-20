import BigNumber from "bignumber.js";

import setup from "../../utils/setup";
import ensure from "../../utils/ensure";
import gasBoost from "../../utils/gasBoost";
import findEventInLog from "../../utils/findEventInLog";
import approve from "../../assets/transactions/approve";
import getBalance from "../../assets/calls/getBalance";
import toProcessable from "../../assets/utils/toProcessable";
import toReadable from "../../assets/utils/toReadable";
import getFundContract from "../../fund/contracts/getFundContract";
import getDataFeedContract from "../../datafeeds/contracts/getDataFeedContract";
// We'll have to bring it back later
// import isSubscribeRequestPermitted from "../../participation/calls/isSubscribeRequestPermitted";
import getAddress from "../../assets/utils/getAddress";
/*
  @param numShares: BigNumber quantity of Shares wanted to receive with decimals
  @param offeredValue: BigNumber quantitiy of Ether willing to offer with decimals
*/
const subscribe = async (
  vaultAddress,
  numShares,
  offeredValue,
  incentiveValue = new BigNumber(0.01),
  subscriber = setup.defaultAccount,
) => {
  const fundContract = await getFundContract(vaultAddress);
  const dataFeedContract = await getDataFeedContract();
  const mlnBalance = await getBalance("MLN-T", subscriber);
  const totalMlnNeeded = new BigNumber(offeredValue).plus(incentiveValue);

  ensure(
    mlnBalance.gte(totalMlnNeeded),
    `Insufficent MLN-T. Need ${totalMlnNeeded.toString()} have: ${mlnBalance.toString()}`,
  );
  ensure(
    await fundContract.isSubscribeAllowed(),
    "Subscriptions to vault are disabled",
  );
  ensure(incentiveValue.gt(0), "incentiveValue must be greater than 0");
  const isValid = await dataFeedContract.isValid(getAddress("MLN-T"));
  ensure(isValid, "Data not valid");

  await approve("MLN-T", vaultAddress, totalMlnNeeded);

  const args = [
    toProcessable(offeredValue, "MLN-T"),
    toProcessable(numShares, "MLN-T"),
    toProcessable(incentiveValue, "MLN-T"),
  ];
  const options = {
    from: subscriber,
  };

  const receipt = await gasBoost(
    fundContract.requestSubscription,
    args,
    options,
  );
  const subscribeRequestLogEntry = findEventInLog("RequestUpdated", receipt);
  const request = await fundContract.requests(subscribeRequestLogEntry.args.id);
  const [, , , numSharesAnnihilated, , , , , , timestamp] = request;

  return {
    numShares: toReadable(numSharesAnnihilated),
    atTimestamp: new Date(timestamp.times(1000).toNumber()),
    id: subscribeRequestLogEntry.args.id,
  };
};

export default subscribe;
