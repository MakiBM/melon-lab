import { ipcMain } from 'electron';
import { PubSub } from 'graphql-subscriptions';
import * as keytar from 'keytar';
import { SubscriptionServer } from '~/shared/ipc/server';
import ipcMessages from '~/shared/constants/ipcMessages';
import schema from '@melonproject/graphql-schema';
import { getConfig, getParityProvider } from '@melonproject/melon.js';

const debug = require('debug')('melon-lab:manager-interface:electron');

const KEYCHAIN_SERVICE_NAME = 'melon.fund';

const registerIpcMessageHandler = (name, handler) =>
  ipcMain.on(
    name,
    (event, requestId, ...params) =>
      debug('onIpcMessage', ipcMessages.GET_WALLETS, requestId, params) ||
      handler(...params)
        .then((...result) =>
          event.sender.send(`${name}-success`, requestId, ...result),
      )
        .catch(error => event.sender.send(`${name}-error`, requestId, error)),
  );

const linkKeytar = () => {
  registerIpcMessageHandler(ipcMessages.GET_WALLETS, () =>
    keytar.findCredentials(KEYCHAIN_SERVICE_NAME),
  );

  registerIpcMessageHandler(
    ipcMessages.STORE_WALLET,
    (address, encryptedWallet) =>
      keytar.setPassword(KEYCHAIN_SERVICE_NAME, address, encryptedWallet),
  );

  registerIpcMessageHandler(ipcMessages.DELETE_WALLET, address =>
    keytar.deletePassword(KEYCHAIN_SERVICE_NAME, address),
  );
};

function retrieveNetwork(track: string) {
  switch (track) {
    case 'live':
      return 'LIVE';
    case 'kovan-competition':
    case 'kovan-demo':
      return 'KOVAN';
    default:
      return 'KOVAN';
  }
}

export default async () => {
  try {
    const track = (process.env.TRACK as string) || 'kovan-demo';
    const environment = {
      ...(await getParityProvider(process.env.JSON_RPC_ENDPOINT)),
      track,
    };

    const config = await getConfig(environment);
    const network = retrieveNetwork(track);

    linkKeytar();

    return new SubscriptionServer(
      {
        channel: 'graphql',
        messenger: ipcMain,
      },
      {
        schema,
        context: {
          pubsub: new PubSub(),
          network,
          config,
          environment,
        },
      },
    );
  }
  catch (error) {
    console.error('OOOPSIII', error);
  }
};
