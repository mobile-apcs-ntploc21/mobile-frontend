import { useAuth } from '@/context/AuthProvider';

import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();

  // if not initialized, show loading spinner
  if (!isInitialized) {
    return <ActivityIndicator />;
  }

  console.log('isAuthenticated', isAuthenticated, 'user', user);

  // if logged in, redirect to home
  if (isAuthenticated && user) {
    return <Redirect href="/servers" />;
  }

  // if not logged in, redirect to login
  return <Redirect href="/login" />;
}
