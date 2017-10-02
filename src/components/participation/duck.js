export const initialState = {
  amount: "Amount",
  price: "Price per share",
  total: "Total",
  loading: false,
  participationType: "Invest",
};

export const types = {
  INVEST: "INVEST:participation:melon.network",
  CHANGE: "CHANGE:participation:melon.network",
  REQUEST_PRICE: "REQUEST_PRICE:participation:melon.network",
};

export const creators = {
  invest: () => ({
    type: types.INVEST,
  }),
  change: newValues => ({
    type: types.CHANGE,
    ...newValues,
  }),
  request_price: () => ({
    type: types.REQUEST_PRICE,
  }),
};

export const reducer = (state = initialState, action) => {
  const { type, ...params } = action;

  switch (type) {
    case types.CHANGE: {
      return {
        ...state,
        ...params,
      };
    }
    case types.INVEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case types.REQUEST_PRICE: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
};

export default reducer;
