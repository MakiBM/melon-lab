import {
  getAggregatedObservable,
  Order,
} from '@melonproject/exchange-aggregator';
import {
  getParityProvider,
  getPrice,
  getAddress,
  getConfig,
} from '@melonproject/melon.js';
import BigNumber from 'bignumber.js';
import * as R from 'ramda';
import * as Rx from 'rxjs';
import { Context } from '../index';
import withUnsubscribe from '../utils/withUnsubscribe';
const debug = require('debug')('graphql-schema:subscription');

const getPricePromises = (environment, symbols) =>
  symbols.map(symbol =>
    getPrice(environment, symbol).then(price => ({
      symbol,
      price,
    })),
  );

export const price = {
  resolve: (value: number): number => value,
  subscribe: (parent, args, context: Context) => {
    const { pubsub } = context;
    const { symbols } = args;

    const fetchPrices = environment =>
      Rx.Observable.forkJoin(...getPricePromises(environment, symbols));

    const environment$ = Rx.Observable.fromPromise(
      getParityProvider(process.env.JSON_RPC_ENDPOINT),
    );
    const price$ = environment$
      .switchMap(fetchPrices)
      .repeatWhen(Rx.operators.delay(10000));

    const channel = `price:${symbols}`;
    const iterator = pubsub.asyncIterator(channel);
    const publish = value => pubsub.publish(channel, value);
    return withUnsubscribe(price$, iterator, publish);
  },
};

const filterBuyOrders = R.filter<Order>(R.propEq('type', 'buy'));
const filterSellOrders = R.filter<Order>(R.propEq('type', 'sell'));

const accumulateSells = (accumulator: BigNumber, order: Order) => {
  const volume = accumulator.plus(order.sell.howMuch);
  return [volume, { order, volume }];
};

const accumulateBuys = (accumulator: BigNumber, order: Order) => {
  const volume = accumulator.plus(order.buy.howMuch);
  return [volume, { order, volume }];
};

export const orderbook = {
  resolve: (orders: Order[]) => {
    const [totalBuyVolume, buyEntries] = R.compose(
      R.mapAccum(accumulateBuys, new BigNumber(0)),
      filterBuyOrders,
    )(orders);

    const [totalSellVolume, sellEntries] = R.compose(
      R.mapAccum(accumulateSells, new BigNumber(0)),
      filterSellOrders,
    )(orders);

    return {
      allOrders: orders,
      buyEntries,
      sellEntries,
      totalSellVolume,
      totalBuyVolume,
    };
  },
  subscribe: async (parent, args, context: Context) => {
    const { pubsub, network } = context;
    const { baseTokenSymbol, quoteTokenSymbol, exchanges } = args;
    const environment = await getParityProvider(process.env.JSON_RPC_ENDPOINT);
    const config = await getConfig(environment, network);
    const baseTokenAddress = getAddress(config, baseTokenSymbol);
    const quoteTokenAddress = getAddress(config, quoteTokenSymbol);
    debug('Processed symbols.', {
      baseTokenSymbol,
      quoteTokenSymbol,
    });
    const orderbook$ = getAggregatedObservable(
      baseTokenAddress,
      quoteTokenAddress,
      exchanges,
      network,
    );

    const channel = `orderbook:${baseTokenSymbol}/${quoteTokenSymbol}`;
    const iterator = pubsub.asyncIterator(channel);
    const publish = value => pubsub.publish(channel, value);
    return withUnsubscribe(orderbook$, iterator, publish);
  },
};

export { Order };

export default {
  price,
  orderbook,
};
