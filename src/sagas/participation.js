import { takeLatest, select, call, put } from "redux-saga/effects";
import { subscribe, redeem, executeRequest } from "@melonproject/melon.js";
import { types, actions } from "../actions/participation";
import { actions as appActions } from "../actions/app";
import { actions as fundActions } from "../actions/fund";

function* subscribeSaga(action) {
  try {
    yield put(appActions.transactionStarted());
    const fundAddress = yield select(state => state.fund.address);
    const subscription = yield call(
      subscribe,
      fundAddress,
      action.amount,
      action.total,
    );
    yield call(executeRequest, subscription.id, fundAddress);
    yield put(actions.subscribeSucceeded());
    yield put(fundActions.infoRequested(fundAddress));
  } catch (err) {
    console.error(err);
    yield put(actions.subscribeFailed());
  } finally {
    yield put(appActions.transactionFinished());
  }
}

function* redeemSaga(action) {
  try {
    yield put(appActions.transactionStarted());
    const fundAddress = yield select(state => state.fund.address);
    yield call(redeem, fundAddress, action.amount, action.total);
    yield put(actions.redeemSucceeded());
    yield put(fundActions.infoRequested(fundAddress));
  } catch (err) {
    console.error(err);
    yield put(actions.redeemFailed());
  } finally {
    yield put(appActions.transactionFinished());
  }
}

function* participation() {
  yield takeLatest(types.SUBSCRIBE_REQUESTED, subscribeSaga);
  yield takeLatest(types.REDEEM_REQUESTED, redeemSaga);
}

export default participation;
