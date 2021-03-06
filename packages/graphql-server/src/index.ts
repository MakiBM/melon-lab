import schema, { Network } from '@melonproject/graphql-schema';
import { getConfig, getParityProvider } from '@melonproject/melon.js';
import { graphqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

function retrieveNetwork(network: string): Network {
  switch (network.toUpperCase()) {
    case 'LIVE':
      return 'LIVE';
    case 'KOVAN':
      return 'KOVAN';
    default:
      return 'KOVAN';
  }
}

type Track = 'kovan-demo' | 'kovan-competition' | 'live';

function retrieveTrack(network: Network): Track {
  if (network === 'LIVE') {
    return 'live';
  }

  return 'kovan-demo';
}

async function start(port: number) {
  const app = express();

  const pubsub = new PubSub();
  const network = retrieveNetwork((process.env.NETWORK as string) || 'KOVAN');
  const track = retrieveTrack(network);
  const environment = Object.assign(await getParityProvider(process.env.JSON_RPC_ENDPOINT), { track });
  const config = await getConfig(environment);

  const context = {
    pubsub,
    network,
    environment,
    config,
  };

  const json = bodyParser.json();

  const gql = graphqlExpress({
    schema,
    context,
  });

  app.use('/', json, gql);

  const server = createServer(app);

  // tslint:disable-next-line:no-unused-expression
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
      onOperation: (message, params, socket) => ({
        ...params,
        context,
      }),
    },
    {
      server,
      path: '/',
    },
  );

  server.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server is running on http://localhost:${port}`);
  });
}

start(parseInt(process.env.PORT as string, 10));
