import * as R from 'ramda';
import * as Rx from 'rxjs';
import { getParityProvider, getConfig } from '@melonproject/melon.js';
import formatRelayerOrderbook from '../../formatRelayerOrderbook';
import getTokenAddress from '../../getTokenAddress';
import { Order } from '../../index';

// Isomorphic websocket implementation. Falls back to the standard browser
// protocol on the client.
import WebSocket = require('isomorphic-ws');

const debug = require('debug')('exchange-aggregator:radar-relay');

const subscribeMessage = (baseTokenAddress, quoteTokenAddress) =>
  JSON.stringify({
    type: 'subscribe',
    channel: 'orderbook',
    requestId: 1,
    payload: {
      baseTokenAddress,
      quoteTokenAddress,
      snapshot: true,
      limit: 1000,
    },
  });

// @TODO: Finish this type.
interface RelayOrder {
  salt: string;
  expirationUnixTimestampSec: string;
}

interface AsksAndBids {
  asks: RelayOrder[];
  bids: RelayOrder[];
}

interface SnapshotMessage {
  type: 'snapshot';
  payload: AsksAndBids;
}

interface UpdateMessage {
  type: 'update';
  payload: RelayOrder;
}

const isSnapshotMessage = R.propEq('type', 'snapshot') as (
  payload: any,
) => payload is SnapshotMessage;

const isUpdateMessage = R.propEq('type', 'update') as (
  payload: any,
) => payload is UpdateMessage;

const scanMessages: (
  carry: AsksAndBids,
  current: SnapshotMessage | UpdateMessage,
) => AsksAndBids = R.cond([
  [
    (carry: AsksAndBids, current: SnapshotMessage) => {
      return isSnapshotMessage(current);
    },
    (carry: AsksAndBids, current: SnapshotMessage) => {
      current.payload.bids = current.payload.bids.filter(
        order =>
          order.expirationUnixTimestampSec >
          parseInt(new Date().getTime() / 1000),
      );
      current.payload.asks = current.payload.asks.filter(
        order =>
          order.expirationUnixTimestampSec >
          parseInt(new Date().getTime() / 1000),
      );
      return current.payload;
    },
  ],
  [
    (carry: AsksAndBids, current: SnapshotMessage) => {
      return isUpdateMessage(current);
    },
    (carry: AsksAndBids, current: UpdateMessage) => {
      return updateAsksAndBids(carry, current.payload);
    },
  ],
  [R.T, R.identity],
]);

const updateAsksAndBids = (state: AsksAndBids, order: RelayOrder) => {
  // @TODO: Implement update logic.
  return state;
};

const getObservableRadarRelay = (
  baseTokenAddress,
  quoteTokenAddress,
  network,
) => {
  const url =
    network === 'KOVAN'
      ? 'wss://ws.kovan.radarrelay.com/0x/v0/ws'
      : 'wss://api.radarrelay.com/0x/v0/ws';

  const open$ = new Rx.Subject();
  const close$ = new Rx.Subject();
  const socket$ = Rx.Observable.webSocket({
    url,
    WebSocketCtor: WebSocket,
    openObserver: open$,
    closeObserver: close$,
  });

  const message = subscribeMessage(baseTokenAddress, quoteTokenAddress);

  open$.subscribe(event => {
    socket$.next(message);

    Rx.Observable.interval(5000)
      .takeUntil(close$)
      .subscribe(() => socket$.next('tick'));
  });

  const format = formatRelayerOrderbook('RADAR_RELAY');

  const messages$ = socket$
    .retry()
    .filter(R.propEq('channel', 'orderbook'))
    .filter(R.anyPass([isSnapshotMessage, isUpdateMessage]) as (
      value,
    ) => value is SnapshotMessage | UpdateMessage)
    .do(value => debug('Processing snapshot or update message.', value))
    .do(value => socket$.next(message))
    .scan<SnapshotMessage | UpdateMessage, AsksAndBids>(scanMessages, {
      bids: [],
      asks: [],
    })
    .distinctUntilChanged()
    .do(value => debug('Extracting bids and asks.', value))
    .switchMap(value => {
      const environment$ = Rx.Observable.fromPromise(
        getParityProvider(process.env.JSON_RPC_ENDPOINT),
      );

      const config$ = environment$.switchMap(environment => {
        return Rx.Observable.fromPromise(getConfig(environment));
      });

      return config$.switchMap(config =>
        Rx.Observable.of(format(config, value.bids, value.asks)),
      );
    })
    .do(value => debug('Emitting order book.', value));

  return messages$;
};

export default getObservableRadarRelay;
