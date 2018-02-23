import getConfig from '../../version/calls/getConfig';
import getFundContract from '../../fund/contracts/getFundContract';
import getQuoteAssetSymbol from '../../pricefeeds/calls/getQuoteAssetSymbol';
import getRankingContract from '../contracts/getRankingContract';
import getVersionContract from '../contracts/getVersionContract';
import toReadable from '../../assets/utils/toReadable';

/**
 * Returns an array of all existing funds on current Version, sorted by share price in descending order, with informations such as address, name, share price, and inception date.
 */
const getRanking = async environment => {
  const config = await getConfig(environment);
  const rankingContract = await getRankingContract(environment);
  const quoteAssetSymbol = await getQuoteAssetSymbol(environment);

  const output = await rankingContract.instance.getAddressAndSharePriceOfFunds.call();

  /* eslint-disable no-underscore-dangle */
  const fundAddresses = output[0].map(fund => fund._value);
  const fundSharePrices = output[1].map(fund =>
    toReadable(config, fund._value, quoteAssetSymbol).toNumber(),
  );
  const fundInceptions = output[2].map(fund => fund._value);
  const versionContract = await getVersionContract(environment);
  const lastFundId = await versionContract.instance.getLastFundId.call();
  /* eslint-enable */

  const getRankingPromises = new Array(lastFundId.toNumber() + 1)
    .fill(undefined)
    .map(async (val, index) => {
      const fundContract = getFundContract(fundAddresses[index]);
      const name = await fundContract.instance.getName.call();
      return {
        address: fundAddresses[index],
        name,
        sharePrice: fundSharePrices[index],
        inception: new Date(fundInceptions[index].times(1000).toNumber()),
      };
    });

  const unsortedFunds = await Promise.all(getRankingPromises);
  return unsortedFunds.sort((a, b) => (a.sharePrice > b.sharePrice ? -1 : 1));
};

export default getRanking;
