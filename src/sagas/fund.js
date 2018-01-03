import {
  getFundInformations,
  getParticipation,
  getParticipationAuthorizations,
  performCalculations,
  getFundForManager,
} from "@melonproject/melon.js";
import { takeLatest, put, call, take, select } from "redux-saga/effects";
import { actions, types } from "../actions/fund";
import { types as ethereumTypes } from "../actions/ethereum";
import { actions as appActions, types as appTypes } from "../actions/app";
import { types as routeTypes } from "../actions/routes";
import {
  types as orderbookTypes,
  actions as orderbookActions,
} from "../actions/orderbook";
import {
  types as holdingsTypes,
  actions as holdingsActions,
} from "../actions/holdings";
import {
  types as recentTradesTypes,
  actions as recentTradesActions,
} from "../actions/recentTrades";
import { actions as tradeHistoryActions } from "../actions/tradeHistory";
import { types as tradeTypes } from "../actions/trade";

import {
  actions as rankingActions,
  types as rankingTypes,
} from "../actions/ranking";
import { actions as tradeHelperActions } from "../actions/tradeHelper";

function* requestInfo({ address }) {
  const isConnected = yield select(state => state.ethereum.isConnected);
  if (!isConnected) yield take(ethereumTypes.HAS_CONNECTED);

  try {
    const account = yield select(state => state.ethereum.account);
    const fundInfo = yield call(getFundInformations, address);
    const calculations = yield call(performCalculations, address);
    const participationAuthorizations = yield call(
      getParticipationAuthorizations,
      address,
    );

    const info = {
      ...fundInfo,
      ...calculations,
      ...participationAuthorizations,
      address,
    };

    if (account) {
      const participation = yield call(
        getParticipation,
        fundInfo.fundAddress,
        account,
      );
      info.personalStake = participation.personalStake;
    }

    yield put(actions.infoSucceeded(info));
  } catch (err) {
    console.error(err);
    yield put(actions.infoFailed(err));
  }
}

function* checkAndLoad() {
  // HACK: We should use state.location.payload... but it seems to be broken
  const address = yield select(state => state.location.pathname.slice(1));
  let isReadyToVisit = yield select(state => state.app.isReadyToVisit);

  while (!isReadyToVisit) {
    yield take(appTypes.SET_READY_STATE);
    isReadyToVisit = yield select(state => state.app.isReadyToVisit);
  }

  yield put(actions.infoRequested(address));
}

function* getUsersFund({ account }) {
  if (!account) put(appActions.setUsersFund());
  const fundAddress = yield call(getFundForManager, account);
  // Even if fundAddress is undefined (i.e. user hasnt a fund yet), we dispatch
  // this action to signal that we tried to get the users fund
  yield put(appActions.setUsersFund(fundAddress));
}

function* getRanking() {
  yield put(rankingActions.getRanking());
}

function* tradeHelper() {
  yield put(tradeHelperActions.tradeInfoRequested());
}

function* addRanking() {
  const ranking = yield select(state => state.ranking.rankingList);
  const fundAddress = yield select(state => state.fund.address);
  const rank = ranking.length
    ? ranking.findIndex(
        f => f.address.toLowerCase() === fundAddress.toLowerCase(),
      )
    : "N/A";
  if (rank !== -1) {
    const numberOfFunds = ranking.length ? ranking.length : "N/A";
    yield put(actions.updateRanking({ rank, numberOfFunds }));
  }
}

function* afterTradeUpdate() {
  const fundAddress = yield select(state => state.fund.address);
  yield put(orderbookActions.getOrderbook());
  yield put(holdingsActions.getHoldings(fundAddress));
  yield put(recentTradesActions.getRecentTrades());
  yield put(tradeHistoryActions.getTradeHistory(fundAddress));
  yield put(actions.infoRequested(fundAddress));
}

function* fund() {
  yield takeLatest(types.INFO_REQUESTED, requestInfo);
  yield takeLatest(routeTypes.FUND, checkAndLoad);
  yield takeLatest(ethereumTypes.ACCOUNT_CHANGED, getUsersFund);
  yield takeLatest(orderbookTypes.GET_ORDERBOOK_SUCCEEDED, getRanking);
  yield takeLatest(orderbookTypes.GET_ORDERBOOK_SUCCEEDED, tradeHelper);
  yield takeLatest(holdingsTypes.GET_HOLDINGS_SUCCEEDED, tradeHelper);
  yield takeLatest(recentTradesTypes.GET_RECENTTRADES_SUCCEEDED, tradeHelper);
  yield takeLatest(rankingTypes.GET_RANKING_SUCCEEDED, addRanking);
  yield takeLatest(tradeTypes.TAKE_ORDER_SUCCEEDED, afterTradeUpdate);
  yield takeLatest(tradeTypes.PLACE_ORDER_SUCCEEDED, afterTradeUpdate);
}

export default fund;
