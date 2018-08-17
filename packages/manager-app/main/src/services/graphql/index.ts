import schema from '@melonproject/graphql-schema';
import { getConfig, getParityProvider } from '@melonproject/melon.js';
import { ipcMain } from 'electron';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionServer } from '~/shared/ipc/server';

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
  const track = (process.env.TRACK as string) || 'kovan-demo';
  const environment = {
    ...(await getParityProvider(process.env.JSON_RPC_ENDPOINT)),
    track,
  };

  const config = await getConfig(environment);
  const network = retrieveNetwork(track);

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
};
