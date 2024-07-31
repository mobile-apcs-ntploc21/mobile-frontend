import { USER_STATUS_SUBSCRIPTION } from '@/services/graphql/subscriptions';
import { getData } from '@/utils/api';
import { useSubscription } from '@apollo/client';
import { useEffect, useState } from 'react';

export const useStatusById = (id: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { data: dataPush } = useSubscription(USER_STATUS_SUBSCRIPTION, {
    variables: { user_id: id }
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await getData(`/api/v1/status/${id}`);
        setData(response);
        setLoading(false);
      } catch (e: any) {
        throw new Error(e.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (dataPush) {
      setData(dataPush.userStatusChanged);
    }
  }, [dataPush]);

  return { data, loading };
};
