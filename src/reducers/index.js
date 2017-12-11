import { combineReducers } from "redux";
import { reducer as form } from "redux-form";
import { routerReducer as router } from "react-router-redux";

import app from "./app";
import fund from "./fund";
import ranking from "./ranking";
import holdings from "./holdings";
import orderbook from "./orderbook";

import ethereum from "./ethereum";
/*
import executeRequest from "../legacyComponents/executeRequest/duck";
import fundHoldings from "../legacyComponents/fundHoldings/duck";
import general from "../legacyComponents/general";
import invest from "../legacyComponents/invest/duck";
import orderbook from "../legacyComponents/orderbook/duck";
import participation from "../legacyComponents/participation/duck";
import recentTrades from "../legacyComponents/recentTrades/duck";
import trade from "../legacyComponents/trade/duck";
import tradeHelper from "../legacyComponents/tradeHelper/duck";
import tradingActivity from "../legacyComponents/tradingActivity/duck";
*/

const rootReducer = combineReducers({
  app,
  router,
  ethereum,
  form,
  fund,
  ranking,
  holdings,
  orderbook,
  /*
  executeRequest,
  fundHoldings,
  general,
  invest,
  orderbook,
  participation,
  recentTrades,
  trade,
  tradeHelper,
  tradingActivity,
  */
});

export default rootReducer;
