import { takeLatest, call, put, take, select, fork } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import {
  getWallet,
  createWallet,
  encryptWallet,
  importWalletFromMnemonic,
  decryptWallet,
  getEnvironment,
  setEnvironment,
} from '@melonproject/melon.js';
import sendIpcMessage from '~/legacy/utils/sendIpcMessage';
import { actions as modalActions, types as modalTypes } from '../actions/modal';
import { types, actions } from '../actions/wallet';
import {
  actions as ethereumActions,
  types as ethereumTypes,
} from '../actions/ethereum';
import {
  actions as routeActions,
  types as routeTypes,
} from '../actions/routes';
import { types as browserTypes } from '../actions/browser';

function* loadWallet() {
  const isElectron = ELECTRON;

  try {
    if (isElectron || process.env.NODE_ENV === 'development') {
      let encryptedWallet;
      let password;

      if (isElectron) {
        const wallets = yield sendIpcMessage('get-wallets');
        if (wallets.length > 0) {
          yield put(
            wallets.length > 1
              ? modalActions.password(
                  `We found ${
                    wallets.length
                  } wallets in your operating system keystore but we only support one. We just took the first (${
                    wallets[0].account
                  }). If that is the wrong one, backup & remove the wrong ones. You can find them in your operating systems keystore (Keychain Access on Mac) and search for "melon.fund". Enter the password this wallet is encrypted with:`,
                )
              : modalActions.password(
                  `Wallet found in OS Keystore (${
                    wallets[0].account
                  }). Enter the password this wallet is encrypted with:`,
                ),
          );
          const action = yield take(modalTypes.PASSWORD_ENTERED);
          password = action.password;
          encryptedWallet = wallets[0].password;
        } else {
          console.log('No wallets found in OS keychain');
        }
      } else {
        encryptedWallet = localStorage.getItem('wallet:melon.fund');

        if (encryptedWallet) {
          yield put(
            modalActions.password(
              `Wallet found in browser storage. Enter the password this wallet is encrypted with:`,
            ),
          );
          const action = yield take(modalTypes.PASSWORD_ENTERED);
          password = action.password;
        }
      }

      if (password) {
        yield put(modalActions.loading('Decrypting ...'));
        const decryptedWallet = yield call(
          decryptWallet,
          encryptedWallet,
          password,
        );
        setEnvironment({ account: decryptedWallet });
        yield put(actions.importWalletSucceeded(decryptedWallet));
        yield put(ethereumActions.accountChanged(`${decryptedWallet.address}`));
        yield put(modalActions.close());
      }
    }
  } catch (error) {
    console.error(error);
    yield put(actions.importWalletFailed(error));
    yield put(
      modalActions.error(`There was an error loading your wallet. ${error}`),
    );
  }
}

// from https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
const createDownload = (data, filename, mime) => {
  var blob = new Blob([data], { type: mime || 'application/octet-stream' });

  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing
    // the URL has been freed."
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var blobURL = window.URL.createObjectURL(blob);
    var tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }

    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }
};

function* storeWallet(decryptedWallet, encryptedWalletParam) {
  try {
    const isElectron = yield select(state => state.app.isElectron);
    let encryptedWalletString = encryptedWalletParam;

    if (isElectron || process.env.NODE_ENV === 'development') {
      if (!encryptedWalletString) {
        yield put(
          modalActions.password(
            `Please type a strong password to protect your wallet:`,
          ),
        );
        const { password } = yield take(modalTypes.PASSWORD_ENTERED);

        if (password.length < 8) {
          yield put(
            modalActions.error(
              'Password needs to be at least 8 chars long. For your security!',
            ),
          );
          return;
        }

        yield put(modalActions.password(`Confirm password:`));
        const { password: confirm } = yield take(modalTypes.PASSWORD_ENTERED);

        if (password !== confirm) {
          yield put(modalActions.error("The entered passwords didn't match"));
          return;
        }

        yield put(modalActions.loading('Encrypting wallet ...'));
        encryptedWalletString = yield call(
          encryptWallet,
          decryptedWallet,
          password,
        );
        yield put(modalActions.close());
      }

      if (isElectron) {
        yield sendIpcMessage(
          'store-wallet',
          decryptedWallet.address,
          encryptedWalletString,
        );
        yield put(
          modalActions.info({
            title: 'Wallet securely stored',
            body: `Your wallet (${
              decryptedWallet.address
            }) is securely stored in your operating systems keystore with the same password.`,
          }),
        );
      } else {
        localStorage.setItem('wallet:melon.fund', encryptedWalletString);
      }
    }
  } catch (error) {
    console.error(error);
    yield put(
      modalActions.error(`There was an error storing your wallet. ${error}`),
    );
  }
}

function* generateMnemonic() {
  try {
    yield put(actions.generateWalletSucceeded(createWallet().mnemonic));
  } catch (error) {
    console.error(error);
    yield put(actions.generateWalletFailed(error));
  }
}

function* restoreWalletSaga({ mnemonic }) {
  try {
    const isElectron = yield select(state => state.app.isElectron);
    const wallet = yield importWalletFromMnemonic(mnemonic);
    setEnvironment({ account: wallet });
    yield put(actions.restoreFromMnemonicSucceeded(wallet));
    yield call(storeWallet, wallet);
    yield put(routeActions.wallet());
    yield put(ethereumActions.accountChanged(`${wallet.address}`));
  } catch (error) {
    console.error(error);
    yield put(actions.restoreFromMnemonicFailed(error));
  }
}

function* deleteWallet() {
  const isElectron = yield select(state => state.app.isElectron);
  const address = yield select(state => state.ethereum.account);

  yield put(
    modalActions.confirm({
      body: `Do you really want to delete your current wallet? This cannot be undone and can lead to loss of funds if you do not have a backup!`,
    }),
  );
  yield take(modalTypes.CONFIRMED);
  yield put(actions.doDeleteWallet());
  yield put(ethereumActions.accountChanged());
  // Delete local storage wallet anyways. If in production, they key should
  // not exist. If it exists, then deletion is ok anyways
  localStorage.removeItem('wallet:melon.fund');
  if (isElectron) {
    try {
      const deleted = yield sendIpcMessage('delete-wallet', address);
      yield put(
        deleted
          ? modalActions.info({
              body: `Your wallet (${address}) was securely removed from your operating systems keystore`,
              title: 'Wallet deleted',
            })
          : modalActions.error(
              `No wallet found in OS keystore with address. ${address}`,
            ),
      );
    } catch (e) {
      console.error(e);
      yield put(
        modalActions.error(`There was an error deleting your wallet. ${e}`),
      );
    }
  }
  yield put(routeActions.root());
}

function* downloadJSON() {
  yield put(
    modalActions.password(
      `Please type a strong password to encrypt your wallet JSON with:`,
    ),
  );
  const { password } = yield take(modalTypes.PASSWORD_ENTERED);

  if (password.length < 8) {
    yield put(
      modalActions.error(
        'Password needs to be at least 8 chars long. For your security!',
      ),
    );
    return;
  }

  yield put(modalActions.password(`Confirm password:`));
  const { password: confirm } = yield take(modalTypes.PASSWORD_ENTERED);

  if (password !== confirm) {
    yield put(modalActions.error("The entered passwords didn't match"));
    return;
  }

  yield put(modalActions.loading());
  const privateKey = yield select(state => state.wallet.privateKey);
  const address = yield select(state => state.ethereum.account);
  const wallet = getWallet(privateKey);
  const encryptedWallet = yield call(encryptWallet, wallet, password);

  createDownload(
    encryptedWallet,
    `olympiad.melon.fund-${address}.json`,
    'application/json',
  );

  yield put(modalActions.close());
}

function* importWallet({ encryptedWalletString }) {
  try {
    yield put(
      modalActions.password(
        `Enter the password this wallet is encrypted with:`,
      ),
    );

    const { password } = yield take(modalTypes.PASSWORD_ENTERED);
    yield put(modalActions.loading('Decrypting ...'));
    const decryptedWallet = yield call(
      decryptWallet,
      encryptedWalletString,
      password,
    );
    setEnvironment({ account: decryptedWallet });
    yield put(actions.importWalletSucceeded(decryptedWallet));
    yield call(storeWallet, decryptedWallet, encryptedWalletString);
    yield put(ethereumActions.accountChanged(`${decryptedWallet.address}`));
    yield put(routeActions.wallet());
    yield put(modalActions.close());
  } catch (e) {
    console.error(e);
    yield put(actions.importWalletFailed(e));
    yield put(modalActions.error('Failed to decrypt wallet. Wrong password?'));
  }
}

function* wallet() {
  yield takeLatest(ethereumTypes.SET_PROVIDER, loadWallet);
  yield takeLatest(types.RESTORE_FROM_MNEMONIC_REQUESTED, restoreWalletSaga);
  yield takeLatest(types.DELETE_WALLET_REQUESTED, deleteWallet);
  yield takeLatest(types.IMPORT_WALLET_REQUESTED, importWallet);
  yield takeLatest(types.DOWNLOAD_JSON, downloadJSON);
  yield takeLatest(routeTypes.WALLET_GENERATE, generateMnemonic);
}

export default wallet;
