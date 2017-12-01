import { partial } from "ramda";
import { providers, networks } from "@melonproject/melon.js";
import isBefore from "../utils/isBefore";
import { types as ethereumTypes } from "../actions/ethereum";
import { types as fundTypes } from "../actions/fund";
import { types as appTypes } from "../actions/app";

// Note: These items are sorted: NO_PROVIDER is the state before NO_CONNECTION
// and so on. (Thats why it is named ...Path and not ...States)
export const onboardingPath = {
  NO_PROVIDER: "No provider",
  NO_CONNECTION: "No connection",
  WRONG_NETWORK: "Wrong network",
  LOCKED_ACCOUNT: "Locked account",
  INSUFFICENT_ETH: "Insufficent ETH",
  INSUFFICENT_MLN: "Insufficent MLN",
  NO_FUND_CREATED: "No fund created ",
  NOT_INVESTED_IN_OWN_FUND: "Not invested in own fund",
  NOT_TRADED_YET: "Not traded yet",
  ONBOARDED: "Onboarded",
};

const isBeforeInPath = partial(isBefore, [Object.values(onboardingPath)]);

const initialState = {
  onboardingState: onboardingPath.NO_PROVIDER,
  isConnected: false,
  isReadyToVisit: false,
  isReadyToInteract: false,
  isReadyToTrade: false,
  transactionInProgress: false,
  usersFund: "",
};

const isReadyToVisit = ({ network }) => network === "42";

const isReadyToInteract = ({
  blockNumber,
  syncing,
  network,
  account,
  ethBalance,
}) =>
  isReadyToVisit({ syncing, network }) &&
  !syncing &&
  !!account &&
  ethBalance.gt(0) &&
  blockNumber > 0;

const reducers = {
  setProvider: (state, params) => ({
    ...state,
    onboardingState:
      params.provider !== providers.NONE
        ? onboardingPath.NO_CONNECTION
        : onboardingPath.NO_PROVIDER,
  }),
  setConnection: (state, params) => ({
    ...state,
    onboardingState:
      params.network === networks.KOVAN
        ? onboardingPath.LOCKED_ACCOUNT
        : onboardingPath.WRONG_NETWORK,
  }),
  newBlock: (state, params) => {
    const newState = {
      ...state,
      isConnected: true,
      isReadyToVisit: isReadyToVisit(params),
      isReadyToInteract: isReadyToInteract(params),
    };

    if (params.network !== networks.KOVAN) {
      return { ...newState, onboardingState: onboardingPath.WRONG_NETWORK };
    } else if (!params.account) {
      return { ...newState, onboardingState: onboardingPath.LOCKED_ACCOUNT };
    } else if (params.ethBalance.lte(0)) {
      return { ...newState, onboardingState: onboardingPath.INSUFFICENT_ETH };
    } else if (params.mlnBalance.lte(0)) {
      return { ...newState, onboardingState: onboardingPath.INSUFFICENT_MLN };
    } else if (
      isBeforeInPath(newState.onboardingState, onboardingPath.NO_FUND_CREATED)
    ) {
      return { ...newState, onboardingState: onboardingPath.NO_FUND_CREATED };
    } else if (
      !isBeforeInPath(newState.onboardingState, onboardingPath.NOT_TRADED_YET)
    ) {
      return { ...newState, isReadyToTrade: true };
    }

    return { ...newState };
  },
  transactionStarted: state => ({
    ...state,
    transactionInProgress: true,
  }),
  transactionFinished: state => ({
    ...state,
    transactionInProgress: false,
  }),
  setupSucceeded: state => ({
    ...state,
    transactionInProgress: false,
    onboardingState: onboardingPath.NOT_INVESTED_IN_OWN_FUND,
  }),
  infoSucceeded: (state, params) => ({
    ...state,
    onboardingState:
      params.totalSupply === "0"
        ? onboardingPath.NOT_INVESTED_IN_OWN_FUND
        : onboardingPath.NOT_TRADED_YET,
  }),
  merge: (state, params) => ({
    ...state,
    ...params,
  }),
  default: state => ({ ...state }),
};

const mapActionToReducer = {
  [ethereumTypes.SET_PROVIDER]: reducers.setProvider,
  [ethereumTypes.HAS_CONNECTED]: reducers.setConnection,
  [ethereumTypes.NEW_BLOCK]: reducers.newBlock,
  [fundTypes.SETUP_SUCCEEDED]: reducers.setupSucceeded,
  [fundTypes.INFO_SUCCEEDED]: reducers.infoSucceeded,
  [appTypes.TRANSACTION_STARTED]: reducers.transactionStarted,
  [appTypes.TRANSACTION_FINISHED]: reducers.transactionFinished,
  [appTypes.SET_USERS_FUND]: reducers.merge,
};

export const reducer = (state = initialState, action = {}) => {
  const { type, ...params } = action;

  const matchedReducer = mapActionToReducer[type] || reducers.default;
  const newState = matchedReducer(state, params);

  return newState;
};

export default reducer;
