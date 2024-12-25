import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
};

const useDeviceToken = (): string | null => {
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const hasPermission = await requestUserPermission();
      if (hasPermission) {
        messaging().getToken().then(token => setDeviceToken(token));
      } else {
        throw 'No permission to send push notifications';
      }
    })();
  }, []);
  return deviceToken;
};

export default useDeviceToken;