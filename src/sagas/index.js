import { fork } from "redux-saga/effects";

import administration from "./administration";
import app from "./app";
import ethereum from "./ethereum";
import fund from "./fund";
import setup from "./setup";
import ranking from "./ranking";
import holdings from "./holdings";
import orderbook from "./orderbook";

function* rootSaga() {
  yield fork(administration);
  yield fork(app);
  yield fork(ethereum);
  yield fork(fund);
  yield fork(setup);
  yield fork(ranking);
  yield fork(holdings);
  yield fork(orderbook);
}

export default rootSaga;
