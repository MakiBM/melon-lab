import { getPrices, getSymbol, toReadable } from '@melonproject/melon.js';

const formatRelayerOrderbook = exchange => (config, bids, asks) => {
  const formattedBids = bids.map(order => {
    try {
      const makerSymbol = getSymbol(config, order.makerTokenAddress);
      const takerSymbol = getSymbol(config, order.takerTokenAddress);
      const makerAmount = order.makerTokenAmount;
      const takerAmount = order.takerTokenAmount;

      const makerHowMuch = toReadable(config, makerAmount, makerSymbol);
      const takerHowMuch = toReadable(config, takerAmount, takerSymbol);

      return {
        salt: order.salt,
        maker: order.maker,
        taker: order.taker,
        isActive: true,
        sell: {
          symbol: makerSymbol,
          howMuch: makerHowMuch,
        },
        buy: {
          symbol: takerSymbol,
          howMuch: takerHowMuch,
        },
        type: 'buy',
        makerFee: order.makerFee,
        takerFee: order.takerFee,
        signature: order.ecSignature,
        expiration: order.expirationUnixTimestampSec,
        feeRecipient: order.feeRecipient,
        exchangeContractAddress: order.exchangeContractAddress,
        exchange,
      }
    }
    catch (e) {
      return undefined;
    }
  }).filter(order => typeof order !== 'undefined');

  const formattedAsks = asks.map(order => {
    try {
      const makerSymbol = getSymbol(config, order.makerTokenAddress);
      const takerSymbol = getSymbol(config, order.takerTokenAddress);
      const makerAmount = order.makerTokenAmount;
      const takerAmount = order.takerTokenAmount;

      const makerHowMuch = toReadable(config, makerAmount, makerSymbol);
      const takerHowMuch = toReadable(config, takerAmount, takerSymbol);

      return {
        salt: order.salt,
        maker: order.maker,
        taker: order.taker,
        isActive: true,
        sell: {
          symbol: makerSymbol,
          howMuch: makerHowMuch,
        },
        buy: {
          symbol: takerSymbol,
          howMuch: takerHowMuch,
        },
        type: 'sell',
        makerFee: order.makerFee,
        takerFee: order.takerFee,
        signature: order.ecSignature,
        expiration: order.expirationUnixTimestampSec,
        feeRecipient: order.feeRecipient,
        exchangeContractAddress: order.exchangeContractAddress,
        exchange,
      }
    }
    catch (e) {
      return undefined;
    }
  }).filter(order => typeof order !== 'undefined');

  const orderbook = [...formattedBids, ...formattedAsks].map(order => ({
    ...order,
    price: order.type === 'buy' ? getPrices(order).buy : getPrices(order).sell,
  }));

  return orderbook;
};

export default formatRelayerOrderbook;
