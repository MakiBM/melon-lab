import { takeLatest, call, put, select, take } from "redux-saga/effects";
import { getOrderbook } from "@melonproject/melon.js";
import { types, actions } from "../actions/orderbook";
import { types as ethereumTypes } from "../actions/ethereum";

function* getOrderbookSaga() {
  const assetPair = yield select(state => state.app.assetPair);
  const baseTokenSymbol = assetPair.split("/")[0];
  const quoteTokenSymbol = assetPair.split("/")[1];

  const isConnected = yield select(state => state.ethereum.isConnected);
  if (!isConnected) yield take(ethereumTypes.HAS_CONNECTED);

  try {
    const rawOrderbook = yield call(
      getOrderbook,
      baseTokenSymbol,
      quoteTokenSymbol
    );
    const orders = rawOrderbook.map(order => {
      const result = order;
      result.price = order.price.toString();
      result.cumulativeVolume = order.cumulativeVolume.toString();
      result.buy.howMuch = order.buy.howMuch.toString();
      result.sell.howMuch = order.sell.howMuch.toString();
      return result;
    });
    const sellOrders = orders.filter(o => o.type === "sell").reverse();
    const buyOrders = orders.filter(o => o.type === "buy");
    const totalSellVolume = buyOrders.length
      ? buyOrders[buyOrders.length - 1].cumulativeVolume
      : 0;
    const totalBuyVolume = sellOrders.length
      ? sellOrders[sellOrders.length - 1].cumulativeVolume
      : 0;
    yield put(
      actions.getOrderbookSucceeded({
        orders,
        sellOrders,
        buyOrders,
        totalSellVolume,
        totalBuyVolume
      })
    );
  } catch (err) {
    console.error(err);
    yield put(actions.getOrderbookFailed(err));
  }
}

function* orderbook() {
  yield takeLatest(types.GET_ORDERBOOK_REQUESTED, getOrderbookSaga);
}

export default orderbook;
