// Finished is agnostic of success or failure -> Both are finished
export const types = {
  TRANSACTION_STARTED: "TRANSACTION_STARTED:app:melon.fund",
  TRANSACTION_FINISHED: "TRANSACTION_FINISHED:app:melon.fund",
  SET_USERS_FUND: "SET_USERS_FUND:app:melon.fund",
};

export const actions = {
  transactionStarted: () => ({
    type: types.TRANSACTION_STARTED,
  }),
  transactionFinished: () => ({
    type: types.TRANSACTION_FINISHED,
  }),
  setUsersFund: usersFund => ({
    type: types.SET_USERS_FUND,
    usersFund,
  }),
};
