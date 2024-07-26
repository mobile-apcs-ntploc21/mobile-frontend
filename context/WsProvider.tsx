import { StyleSheet, Text, View } from 'react-native';
import { ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { ApolloProvider } from '@apollo/client';
import createWsClient from '@/services/graphql';

interface WsProviderProps {
  children: ReactNode;
}

const WsProvider = ({ children }: WsProviderProps) => {
  const { user } = useAuth();
  return (
    <ApolloProvider client={createWsClient(user?.jwtToken)}>
      {children}
    </ApolloProvider>
  );
};

export default WsProvider;

const styles = StyleSheet.create({});
