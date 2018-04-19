import CanonicalPriceFeedAbi from '@melonproject/protocol/out/pricefeeds/CanonicalPriceFeed.abi.json';
import getConfig from '../../version/calls/getConfig';

/**
 * Gets contract instance of deployed canonical Pricefeed
 */
const getCanonicalPriceFeedContract = async environment => {
  const config = await getConfig(environment);
  return environment.api.newContract(
    CanonicalPriceFeedAbi,
    config.canonicalPricefeedAddress,
  );
};

export default getCanonicalPriceFeedContract;
