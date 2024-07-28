import { StyleSheet, Text, View } from 'react-native';
import { ReactNode, useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import createWsClient from '@/services/graphql';
import { getIdToken } from '@/services/auth';

interface WsProviderProps {
  children: ReactNode;
}

const WsProvider = ({ children }: WsProviderProps) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getIdToken();
      setToken(token);
    })();
  }, []);

  return (
    <ApolloProvider client={createWsClient(token)}>{children}</ApolloProvider>
  );
};

export default WsProvider;

const styles = StyleSheet.create({});
