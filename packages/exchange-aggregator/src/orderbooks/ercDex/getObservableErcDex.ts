import axios from 'axios';
import * as R from 'ramda';
import * as Rx from 'rxjs';
import formatRelayerOrderbook from '../../formatRelayerOrderbook';
import getStemmedSymbol from '../../getStemmedSymbol';
import getTokenAddress from '../../getTokenAddress';

// Isomorphic websocket implementation. Falls back to the standard browser
// protocol on the client.
import WebSocket = require('isomorphic-ws');

const debug = require('debug')('exchange-aggregator:erc-dex');

const fetchOrderbook = async (baseTokenAddress, quoteTokenAddress) => {
  const endpoint = 'https://api.ercdex.com/api/standard/1/v0/orderbook';
  const params = {
    baseTokenAddress,
    quoteTokenAddress,
  };

  debug('Fetching orderbook', params);

  const data = await axios.get(endpoint, {
    params,
  });

  debug('Fetched orderbook', data.data);

  return data.data;
};

const getObservableErcDexNotifications = (
  baseTokenAddress,
  quoteTokenAddress,
) => {
  const channel = `aggregated-order-feed/${baseTokenAddress}/${quoteTokenAddress}`;

  debug('Connecting to websocket.', channel);

  const open$ = new Rx.Subject();
  const socket$ = Rx.Observable.webSocket({
    url: 'wss://api.ercdex.com',
    WebSocketCtor: WebSocket,
    openObserver: open$,
  });

  open$.subscribe(event => {
    socket$.next(`sub:${channel}`);
  });

  const messages$ = socket$
    // @TODO: In addition to restarting the connection when it's closed, also
    // send a ping signal if there is no activity to prevent closing the websocket
    // connection in the first place.
    .retry()
    .do(value => debug('Received message.', value))
    .filter(R.propEq('channel', channel))
    .do(value => debug(`Received update notification.`, value));

  return messages$;
};

const getObservableErcDex = (baseTokenSymbol, quoteTokenSymbol) => {
  const stemmedBaseTokenSymbol = getStemmedSymbol(baseTokenSymbol);
  const stemmedQuoteTokenSymbol = getStemmedSymbol(quoteTokenSymbol);
  const baseTokenAddress = getTokenAddress(stemmedBaseTokenSymbol);
  const quoteTokenAddress = getTokenAddress(stemmedQuoteTokenSymbol);

  debug('Processed symbols.', {
    baseTokenSymbol,
    quoteTokenSymbol,
    stemmedBaseTokenSymbol,
    stemmedQuoteTokenSymbol,
    baseTokenAddress,
    quoteTokenAddress,
  });

  const response$ = Rx.Observable.defer(() =>
    fetchOrderbook(baseTokenAddress, quoteTokenAddress),
  ).repeatWhen(() =>
    getObservableErcDexNotifications(baseTokenAddress, quoteTokenAddress),
  );

  const format = formatRelayerOrderbook('RADAR_RELAY');

  return response$
    .distinctUntilChanged()
    .do(value => debug('Extracting bids and asks.', value))
    .map(value => format(value.bids, value.asks));
};

export default getObservableErcDex;
