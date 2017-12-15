export const types = {
  GENERATE_WALLET_REQUESTED: "GENERATE_WALLET_REQUESTED:newuser:melon.fund",
  GENERATE_WALLET_SUCCEEDED: "GENERATE_WALLET_SUCCEEDED:newuser:melon.fund",
  GENERATE_WALLET_FAILED: "GENERATE_WALLET_FAILED:newuser:melon.fund",
  ENCRYPT_WALLET_REQUESTED: "ENCRYPT_WALLET_REQUESTED:newuser:melon.fund",
  ENCRYPT_WALLET_SUCCEEDED: "ENCRYPT_WALLET_SUCCEEDED:newuser:melon.fund",
  RESTORE_FROM_MNEMONIC_REQUESTED:
    "RESTORE_FROM_MNEMONIC_REQUESTED:newuser:melon.fund",
  I_SAVED: "I_SAVED:newuser:melon.fund",
};

export const actions = {
  generateWallet: () => ({
    type: types.GENERATE_WALLET_REQUESTED,
  }),
  generateWalletFailed: reason => ({
    type: types.GENERATE_WALLET_FAILED,
    reason,
  }),
  generateWalletSucceeded: (newAddress, mnemonic) => ({
    type: types.GENERATE_WALLET_SUCCEEDED,
    hasGenerated: true,
    newAddress,
    mnemonic,
  }),
  encryptWallet: password => ({
    type: types.ENCRYPT_WALLET_REQUESTED,
    password,
  }),
  encryptWalletSucceeded: () => ({
    type: types.ENCRYPT_WALLET_SUCCEEDED,
    hasEncrypted: true,
  }),
  iSaved: () => ({
    type: types.I_SAVED,
    hasSavedMnemonic: true,
    mnemonic: "",
  }),
  restoreFromMnemonic: mnemonic => ({
    type: types.RESTORE_FROM_MNEMONIC_REQUESTED,

    mnemonic,
  }),
};
