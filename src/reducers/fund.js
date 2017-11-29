import { types } from "../actions/fund";

export const initialState = {
  address: "",
  creationDate: 0,
  gav: "0",
  id: 0,
  managementFee: 0,
  managementReward: "0",
  name: "-",
  nav: "0",
  owner: "",
  performanceFee: 0,
  performanceReward: "0",
  personalStake: "0",
  sharePrice: "0",
  totalSupply: "0",
  unclaimedRewards: "0",
};

const reducers = {
  setAddress: (state, { address }) => ({
    ...state,
    address,
  }),
  merge: (state, params) => ({
    ...state,
    ...params,
  }),
  default: state => ({ ...state }),
};

const mapActionToReducer = {
  [types.SET]: reducers.setAddress,
  [types.SETUP_SUCCEEDED]: reducers.merge,
  [types.INFO_SUCCEEDED]: reducers.merge,
};

export const reducer = (state = initialState, action) => {
  const { type, ...params } = action;

  const matchedReducer = mapActionToReducer[type] || reducers.default;
  const newState = matchedReducer(state, params);

  return newState;
};

export default reducer;
