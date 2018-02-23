// @flow
import getPriceFeedContract from '../contracts/getPriceFeedContract';
import getAddress from '../../assets/utils/getAddress';
import getQuoteAssetSymbol from './getQuoteAssetSymbol';
import getConfig from '../../version/calls/getConfig';

import type { Environment } from '../../utils/environment/Environment';
import type { TokenSymbol } from '../../assets/schemas/TokenSymbol';

const hasRecentPrice = async (
  environment: Environment,
  tokenSymbol: TokenSymbol,
): Promise<Boolean> => {
  const config = await getConfig(environment);
  const symbol = tokenSymbol || (await getQuoteAssetSymbol(environment));
  const tokenAddress = getAddress(config, symbol);
  const dataFeedContract = await getPriceFeedContract(environment);
  return dataFeedContract.instance.hasRecentPrice.call({}, [tokenAddress]);
};

export default hasRecentPrice;
