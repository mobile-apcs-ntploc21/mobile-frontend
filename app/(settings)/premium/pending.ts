import React, { useLayoutEffect } from 'react';

import { router, useLocalSearchParams } from 'expo-router';

const Pending = () => {
  const params = useLocalSearchParams();

  useLayoutEffect(() => {
    if (params.vnp_TransactionStatus === '00') {
      router.replace({
        pathname: '/premium/successful',
        params
      });
    } else {
      router.replace({
        pathname: '/premium/failed',
        params
      });
    }
  }, []);

  return null;
};

export default Pending;
