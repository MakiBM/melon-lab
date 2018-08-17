export const types = {
  SETUP: 'SETUP:routes:melon.fund',
  ROOT: 'ROOT:routes:melon.fund',
  FUND: 'FUND:routes:melon.fund',
  RANKING: 'RANKING:routes:melon.fund',
  WALLET_GENERATE: 'WALLET_GENERATE:routes:melon.fund',
  WALLET_RESTORE: 'WALLET_RESTORE:routes:melon.fund',
  WALLET_CREATE: 'WALLET_CREATE:routes:melon.fund',
  WALLET_IMPORT: 'WALLET_IMPORT:routes:melon.fund',
  WALLET: 'WALLET:routes:melon.fund',
  DONE: 'DONE:routes:melon.fund',
  RESTORE: 'RESTORE:routes:melon.fund',
  COMPETITION: 'COMPETITION:routes:melon.fund',
};

export const routeMap = {
  [types.SETUP]: '/setup',
  [types.ROOT]: '/',
  [types.RANKING]: '/ranking',
  [types.WALLET_GENERATE]: '/wallet/generate',
  [types.WALLET_RESTORE]: '/wallet/restore',
  [types.WALLET_CREATE]: '/wallet/create',
  [types.WALLET_IMPORT]: '/wallet/import',
  [types.WALLET]: '/wallet',
  [types.FUND]: '/fund?address=:address',
  [types.COMPETITION]: '/competition?address=:address',
};

export const actions = {
  fund: address => ({
    type: types.FUND,
    payload: { address },
  }),
  ranking: () => ({
    type: types.RANKING,
  }),
  root: () => ({
    type: types.ROOT,
  }),
  setup: () => ({
    type: types.SETUP,
  }),
  walletGenerate: () => ({
    type: types.WALLET_GENERATE,
  }),
  walletRestore: () => ({
    type: types.WALLET_RESTORE,
  }),
  walletImport: () => ({
    type: types.WALLET_IMPORT,
  }),
  wallet: onboarding => ({
    type: types.WALLET,
    query: onboarding ? { onboarding: true } : null,
  }),
  competition: address => ({
    type: types.COMPETITION,
    payload: { address },
  }),
};
