export const types = {
  INVEST_REQUESTED: "INVEST_REQUESTED:participation:melon.fund",
  INVEST_SUCCEEDED: "INVEST_SUCCEEDED:participation:melon.fund",
  INVEST_FAILED: "INVEST_FAILED:participation:melon.fund",
  REDEEM_REQUESTED: "REDEEM_REQUESTED:participation:melon.fund",
  REDEEM_SUCCEEDED: "REDEEM_SUCCEEDED:participation:melon.fund",
  REDEEM_FAILED: "REDEEM_FAILED:participation:melon.fund",
  REDEEM_ALL_OWNED_ASSETS_REQUESTED:
  "REDEEM_ALL_OWNED_ASSETS_REQUESTED:participation:melon.fund",
  REDEEM_ALL_OWNED_ASSETS_SUCCEEDED:
  "REDEEM_ALL_OWNED_ASSETS_SUCCEEDED:participation:melon.fund",
  REDEEM_ALL_OWNED_ASSETS_FAILED:
  "REDEEM_ALL_OWNED_ASSETS_FAILED:participation:melon.fund",
  EXECUTE_REQUESTED: "EXECUTE_REQUESTED:participation:melon.fund",
  EXECUTE_SUCCEEDED: "EXECUTE_SUCCEEDED:participation:melon.fund",
  EXECUTE_FAILED: "EXECUTE_FAILED:participation:melon.fund",
  CONTRIBUTE_REQUESTED: "CONTRIBUTE_REQUESTED:participation:melon.fund",
  CONTRIBUTE_SUCCEEDED: "CONTRIBUTE_SUCCEEDED:participation:melon.fund",
  CONTRIBUTE_FAILED: "CONTRIBUTE_FAILED:participation:melon.fund",
  CLAIM_REWARD_ASSETS_REQUESTED:
  "CLAIM_REWARD_ASSETS_REQUESTED:participation:melon.fund",
  CLAIM_REWARD_ASSETS_SUCCEEDED:
  "CLAIM_REWARD_ASSETS_SUCCEEDED:participation:melon.fund",
  CLAIM_REWARD_ASSETS_FAILED:
  "CLAIM_REWARD_ASSETS_FAILED:participation:melon.fund",
};

export const actions = {
  invest: ({ amount, total, directlyExecute }) => ({
    type: types.INVEST_REQUESTED,
    amount,
    total,
    directlyExecute,
  }),
  investFailed: reason => ({
    type: types.INVEST_FAILED,
    reason,
  }),
  investSucceeded: () => ({
    type: types.INVEST_SUCCEEDED,
  }),
  redeem: ({ amount, total }) => ({
    type: types.REDEEM_REQUESTED,
    amount,
    total,
  }),
  redeemFailed: reason => ({
    type: types.REDEEM_FAILED,
    reason,
  }),
  redeemSucceeded: () => ({
    type: types.REDEEM_SUCCEEDED,
  }),
  redeemAllOwnedAssets: ({ amount }) => ({
    type: types.REDEEM_ALL_OWNED_ASSETS_REQUESTED,
    amount,
  }),
  redeemAllOwnedAssetsFailed: reason => ({
    type: types.REDEEM_ALL_OWNED_ASSETS_FAILED,
    reason,
  }),
  redeemAllOwnedAssetsSucceeded: () => ({
    type: types.REDEEM_ALL_OWNED_ASSETS_SUCCEEDED,
  }),
  execute: id => ({
    type: types.EXECUTE_REQUESTED,
    id,
  }),
  executeFailed: reason => ({
    type: types.EXECUTE_FAILED,
    reason,
  }),
  executeSucceeded: () => ({
    type: types.EXECUTE_SUCCEEDED,
  }),
  contribute: ({ amount, total, directlyExecute }) => ({
    type: types.CONTRIBUTE_REQUESTED,
    amount,
    total,
    directlyExecute,
  }),
  contributeFailed: reason => ({
    type: types.CONTRIBUTE_FAILED,
    reason,
  }),
  contributeSucceeded: () => ({
    type: types.CONTRIBUTE_SUCCEEDED,
  }),
  claimReward: () => ({
    type: types.CLAIM_REWARD_REQUESTED,
  }),
  claimRewardFailed: reason => ({
    type: types.CLAIM_REWARD_FAILED,
    reason,
  }),
  claimRewardSucceeded: () => ({
    type: types.CLAIM_REWARD_SUCCEEDED,
  }),
};
