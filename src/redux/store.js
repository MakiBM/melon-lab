import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import general from "./ducks/general";
import setup from "./ducks/setup";
import invest from "./ducks/invest";
import factsheet from "./ducks/factsheet";
import fundHoldings from "./ducks/fundHoldings";
import orderbook from "./ducks/orderbook";
import recentTrades from "./ducks/recentTrades";

import setupMiddleware from "./middlewares/setup";
import investMiddleware from "./middlewares/invest";
import factsheetMiddleware from "./middlewares/factsheet";
import fundHoldingsMiddleware from "./middlewares/fundHoldings";
import orderbookMiddleware from "./middlewares/orderbook";
import recentTradesMiddleware from "./middlewares/recentTrades";

export default createStore(
  combineReducers({
    general,
    setup,
    invest,
    factsheet,
    fundHoldings,
    orderbook,
    recentTrades,
  }),
  {
    /* preloadedState */
  },
  compose(
    applyMiddleware(
      setupMiddleware,
      investMiddleware,
      factsheetMiddleware,
      fundHoldingsMiddleware,
      orderbookMiddleware,
      recentTradesMiddleware,
    ),
    /* eslint-disable no-underscore-dangle */
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f,
    /* eslint-enable */
  ),
);
