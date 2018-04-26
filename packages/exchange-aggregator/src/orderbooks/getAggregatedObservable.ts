import * as R from 'ramda';
import * as Rx from 'rxjs';
import getExchangeEndpoint from '../getExchangeEndpoint';
import getObservableRelayer from './0x/getObservableRelayer';
import getObservableEtherDelta from './etherdelta/getObservableEtherDelta';
import getObservableOasisDex from './oasisDex/getObservableOasisDex';

import { ExchangeEnum, Order } from '../index';

export type ExchangeCreator = (
  baseTokenAddress: string,
  quoteTokenSymbol: string,
) => Rx.Observable<Order[][]>;

const exchangeToCreatorFunction: { [P in ExchangeEnum]: ExchangeCreator } = {
  RADAR_RELAY: (baseTokenSymbol, quoteTokenSymbol) =>
    getObservableRelayer(
      getExchangeEndpoint.live.radarRelay(),
      baseTokenSymbol,
      quoteTokenSymbol,
    ),
  ETHER_DELTA: (baseTokenSymbol, quoteTokenAddress) =>
    getObservableEtherDelta(
      getExchangeEndpoint.live.etherDelta(baseTokenSymbol),
    ),
  OASIS_DEX: (baseTokenSymbol, quoteTokenSymbol) =>
    getObservableOasisDex(baseTokenSymbol, quoteTokenSymbol),
};

const concatOrderbooks = R.reduce<Order[], Order[]>(R.concat, []);

const sortOrderBooks = R.sort<Order>((a, b) => {
  if (a.type === b.type) {
    return b.price.minus(a.price).toNumber();
  }

  return a.type === 'buy' ? 1 : -1;
});

const getAggregatedObservable = (
  baseTokenSymbol: string,
  quoteTokenSymbol: string,
  exchanges: ExchangeEnum[] = ['RADAR_RELAY', 'ETHER_DELTA', 'OASIS_DEX'],
) => {
  const exchanges$ = Rx.Observable.from<ExchangeEnum>(exchanges);
  const orderbooks$ = exchanges$
    .map(name => exchangeToCreatorFunction[name])
    .map(create => create(baseTokenSymbol, quoteTokenSymbol))
    .combineAll<Rx.Observable<Order[][]>, Order[][]>()
    .distinctUntilChanged();

  // Concat and sort orders across all order books.
  return orderbooks$.map(R.compose(sortOrderBooks, concatOrderbooks));
};

export default getAggregatedObservable;
