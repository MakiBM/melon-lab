import { reducer as form } from "redux-form";

import app from "./app";
import fund from "./fund";
import ranking from "./ranking";
import holdings from "./holdings";
import orderbook from "./orderbook";
import recentTrades from "./recentTrades";
import tradeHistory from "./tradeHistory";
import account from "./account";
import ethereum from "./ethereum";

const reducerMap = {
  app,
  ethereum,
  form,
  fund,
  ranking,
  holdings,
  orderbook,
  recentTrades,
  tradeHistory,
  account,
};

export default reducerMap;
