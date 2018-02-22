// @flow
import BigNumber from 'bignumber.js';
import ensure from '../../utils/generic/ensure';
import findEventInLog from '../../utils/ethereum/findEventInLog';
import getFundContract from '../../fund/contracts/getFundContract';
import sendTransaction from '../../utils/parity/sendTransaction';

import toProcessable from '../../assets/utils/toProcessable';
import toReadable from '../../assets/utils/toReadable';
import getNativeAssetSymbol from '../../version/calls/getNativeAssetSymbol';
import getQuoteAssetSymbol from '../../pricefeeds/calls/getQuoteAssetSymbol';

import type { Address } from '../../assets/schemas/Address';

type Redemption = {
  numShares: BigNumber,
  atTimeStamp: Date,
  id: number,
};

/**
 * Redeem `numShares` of fund at `fundAddress` by requesting `requestedValue`
 * and incentivice execution with `incentiveValue`
 */
const redeem = async (
  environment,
  { fundAddress, numShares, requestedValue, isNativeAsset = false },
): Promise<Redemption> => {
  const fundContract = await getFundContract(environment, fundAddress);

  const symbol = isNativeAsset
    ? await getNativeAssetSymbol(environment)
    : await getQuoteAssetSymbol(environment);

  const isShutDown = await fundContract.instance.isShutDown.call();
  ensure(isShutDown === false, 'Fund is shut down');

  const args = [
    toProcessable(numShares, symbol),
    toProcessable(requestedValue, symbol),
    isNativeAsset,
  ];

  const receipt = await sendTransaction(
    fundContract,
    'requestRedemption',
    args,
    environment,
    {},
  );
  const redeemRequestLogEntry = findEventInLog('RequestUpdated', receipt);
  const request = await fundContract.instance.requests.call({}, [
    redeemRequestLogEntry.params.id.value,
  ]);
  const [, , , , shareQuantity, , , timestamp] = request;

  ensure(
    shareQuantity.eq(toProcessable(numShares, symbol)),
    'requested numShares is not equal to retrieved quantity',
    redeemRequestLogEntry,
  );

  return {
    id: redeemRequestLogEntry.params.id.value,
    numShares: toReadable(shareQuantity),
    timestamp: new Date(timestamp.times(1000).toNumber()),
  };
};

export default redeem;
