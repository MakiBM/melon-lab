import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-client';
import { SubscriptionClient } from '../ipc/client';

const client = ELECTRON && new SubscriptionClient({
  messenger: global.ipcRenderer,
  channel: 'graphql',
});

export default (introspection) => withApollo(() => {
  const link = new ApolloLink(operation => client.request(operation));

  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData: introspection,
      }),
    }),
  });
});
