import { StyleSheet, Text, View } from 'react-native';
import { ReactNode, useEffect, useState, useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import createWsClient from '@/services/graphql';
import { getIdToken } from '@/services/auth';
import { useAuth } from './AuthProvider';

interface WsProviderProps {
  children: ReactNode;
}

const WsProvider = ({ children }: WsProviderProps) => {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  // Get the token when the user changes
  useEffect(() => {
    (async () => {
      if (user) {
        const token = await getIdToken();
        setToken(token);
      } else {
        setToken(null);
      }
    })();
  }, [user]);

  // Use memo to prevent creating a new client on every render
  const client = useMemo(() => createWsClient(token), [token]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default WsProvider;

const styles = StyleSheet.create({});
