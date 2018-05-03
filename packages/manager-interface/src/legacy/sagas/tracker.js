import { takeLatest, takeEvery, call, apply, select } from 'redux-saga/effects';
import { omit } from 'ramda';
import flatten from 'flat';

import { types as appTypes } from '../actions/app';
import { types as routeTypes } from '../actions/routes';
import { types as fundTypes } from '../actions/fund';
import { types as accountTypes } from '../actions/account';
import { types as administrationTypes } from '../actions/administration';
import { types as participationTypes } from '../actions/participation';
import { types as tradeTypes } from '../actions/trade';

const findKeyByValue = (obj, byValue) =>
  Object.keys(obj).find(key => obj[key] === byValue);

const getValues = obj => Object.keys(obj).map(key => obj[key]);

const removeSensitiveData = omit(['mnemonic', 'password', 'wallet']);

function* identify() {
  const userAddress = yield select(state => state.ethereum.account);
  const fundAddress = yield select(state => state.app.usersFund);
  yield call(global.analytics.identify, userAddress, {
    fundAddress,
    userAddress,
  });
}

function* route(action) {
  yield call(global.analytics.page, action.type, {
    path: action.meta.location.current.pathname,
  });
}

const eventActionTypeMap = {
  FundCreated: fundTypes.SETUP_SUCCEEDED,
  AccountCreated: accountTypes.GENERATE_WALLET_SUCCEEDED,
  AccountRestored: accountTypes.RESTORE_FROM_MNEMONIC_SUCCEEDED,
  AccountDeleted: accountTypes.DELETE_WALLET_REQUESTED,
  SubscriptionToggled: administrationTypes.TOGGLE_REDEMPTION_SUCCEEDED,
  RedemptionToggled: administrationTypes.TOGGLE_REDEMPTION_SUCCEEDED,
  UnclaimedRewardsConverted:
    administrationTypes.CONVERT_UNCLAIMED_REWARDS_SUCCEEDED,
  FundShutdown: administrationTypes.SHUTDOWN_SUCCEEDED,
  Subscribed: participationTypes.INVEST_SUCCEEDED,
  Redeemed: participationTypes.REDEEM_SUCCEEDED,
  ParticipationRequestExecuted: participationTypes.EXECUTE_SUCCEEDED,
  OrderPlaced: tradeTypes.PLACE_ORDER_SUCCEEDED,
  OrderTaken: tradeTypes.TAKE_ORDER_SUCCEEDED,
};

function* track(action) {
  const { type, ...payload } = action;
  const name = findKeyByValue(eventActionTypeMap, action.type);
  console.log(name);
  yield call(global.analytics.track, name, removeSensitiveData(payload));
}

function* logBreadcrumps(action) {
  const { type, ...payload } = action;

  const flatPayload = removeSensitiveData(flatten(payload, { delimiter: '_' }));

  if (global.Raven)
    yield apply(global.Raven, global.Raven.captureBreadcrumb, {
      message: action.type,
      category: 'redux-action',
      data: flatPayload,
    });
}

const selectBreadcrumps = action => action.type.includes('melon');

function* tracker() {
  yield takeLatest(appTypes.SET_USERS_FUND, identify);
  yield takeLatest(getValues(routeTypes), route);
  yield takeEvery(getValues(eventActionTypeMap), track);
  yield takeEvery(selectBreadcrumps, logBreadcrumps);
}

export default tracker;
