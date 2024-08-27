import { getData } from '@/utils/api';
import { useSubscription } from '@apollo/client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { USER_STATUS_SUBSCRIPTION } from '@/services/graphql/subscriptions';

interface StatusContextValue {
  data: any;
  loading: boolean;
}

const StatusContext = createContext<StatusContextValue | undefined>(undefined);

export const useStatusContext = () => {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error('useStatusContext must be used within a StatusProvider');
  }
  return context;
};

interface StatusProviderProps {
  children: React.ReactNode;
}

export default function StatusProvider({ children }: StatusProviderProps) {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { data: dataPush } = useSubscription(USER_STATUS_SUBSCRIPTION, {
    variables: { user_id: user?.id },
    skip: !user?.id
  });

  useEffect(() => {
    (async () => {
      try {
        if (user) {
          const response = await getData(`/api/v1/status/`);

          setData(response);
          setLoading(false);
        } else {
          setData(null);
          setLoading(true);
        }
      } catch (e: any) {
        throw new Error(e.message);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (dataPush) {
      setData(dataPush.userStatusChanged);
    }
  }, [dataPush]);

  return (
    <StatusContext.Provider
      value={{
        data,
        loading
      }}
    >
      {children}
    </StatusContext.Provider>
  );
}
