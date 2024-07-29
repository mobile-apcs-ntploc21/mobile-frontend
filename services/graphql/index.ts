import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import config from '@/utils/config';

export default function createWsClient(token: string | null) {
  const wsLink = new GraphQLWsLink(
    createClient({
      url: config.SUBSCRIPTION_URL,
      connectionParams: {
        // Pass the token in the headers
        authorization: token ? `Bearer ${token}` : ''
      }
    })
  );

  return new ApolloClient({
    link: wsLink,
    cache: new InMemoryCache()
  });
}
