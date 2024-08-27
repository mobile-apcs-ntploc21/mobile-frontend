import { USER_PROFILE_SUBSCRIPTION } from '@/services/graphql/subscriptions';
import { getData } from '@/utils/api';
import { useSubscription } from '@apollo/client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useStatusContext } from './StatusProvider';
import { set } from 'mongoose';

interface UserContextValue {
  data: any;
  loading: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export default function UserProvider({ children }: UserProviderProps) {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: onlineStatusData } = useStatusContext();

  const { data: dataPush } = useSubscription(USER_PROFILE_SUBSCRIPTION, {
    variables: { user_id: user?.id },
    skip: !user?.id
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await getData('/api/v1/profile/me');
        setData(response);
        setLoading(false);
      } catch (e: any) {
        setData(null);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (dataPush) {
      setData(dataPush.userProfileUpdated);
    }
  }, [dataPush]);

  return (
    <UserContext.Provider
      value={{
        data: {
          ...data,
          onlineStatus: onlineStatusData
        },
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
