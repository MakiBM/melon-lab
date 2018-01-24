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
import { actions as holdingsActions } from "../actions/holdings";
import { actions as recentTradesActions } from "../actions/recentTrades";
import { actions as tradeHistoryActions } from "../actions/tradeHistory";
import { types as tradeTypes } from "../actions/trade";

import {
  actions as rankingActions,
  types as rankingTypes,
} from "../actions/ranking";

import { types as participationTypes } from "../actions/participation";

function* requestInfo({ address }) {
  const isConnected = yield select(state => state.ethereum.isConnected);
  if (!isConnected) yield take(ethereumTypes.HAS_CONNECTED);

  try {
    const account = yield select(state => state.ethereum.account);
    const fundInfo = yield call(getFundInformations, address);
    yield put(actions.progressiveUpdate({ ...fundInfo, address }));
    const calculations = yield call(performCalculations, address);
    yield put(actions.progressiveUpdate(calculations));

    const participationAuthorizations = yield call(
      getParticipationAuthorizations,
      address,
    );

    yield put(actions.progressiveUpdate(participationAuthorizations));

    const info = {
      ...fundInfo,
      ...calculations,
      ...participationAuthorizations,
      address,
      loading: false,
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
  yield put(actions.setLoading(address));

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
    yield put(actions.updateRanking({ rank: rank + 1, numberOfFunds }));
  }
}

function* afterTradeUpdate() {
  const fundAddress = yield select(state => state.fund.address);
  yield put(actions.sharePriceRequested());
  yield put(holdingsActions.getHoldings(fundAddress));
  yield put(orderbookActions.getOrderbook());
  yield put(recentTradesActions.getRecentTrades());
  yield put(tradeHistoryActions.getTradeHistory(fundAddress));
}

function* requestSharePrice() {
  const fundAddress = yield select(state => state.fund.address);
  const calculations = yield call(performCalculations, fundAddress);
  yield put(
    actions.sharePriceSucceeded({ sharePrice: calculations.sharePrice }),
  );
}

function* afterParticipationUpdate() {
  const fundAddress = yield select(state => state.fund.address);
  yield put(actions.infoRequested(fundAddress));
  yield put(holdingsActions.getHoldings(fundAddress));
}

function* fund() {
  yield takeLatest(types.INFO_REQUESTED, requestInfo);
  yield takeLatest(types.SHARE_PRICE_REQUESTED, requestSharePrice);
  yield takeLatest(routeTypes.FUND, checkAndLoad);
  yield takeLatest(ethereumTypes.ACCOUNT_CHANGED, getUsersFund);
  yield takeLatest(orderbookTypes.GET_ORDERBOOK_SUCCEEDED, getRanking);
  yield takeLatest(rankingTypes.GET_RANKING_SUCCEEDED, addRanking);
  yield takeLatest(tradeTypes.TAKE_ORDER_SUCCEEDED, afterTradeUpdate);
  yield takeLatest(tradeTypes.PLACE_ORDER_SUCCEEDED, afterTradeUpdate);
  yield takeLatest(
    participationTypes.EXECUTE_SUCCEEDED,
    afterParticipationUpdate,
  );
}

export default fund;
