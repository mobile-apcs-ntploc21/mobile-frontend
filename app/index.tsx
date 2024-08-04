import { useAuth } from '@/context/AuthProvider';

import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();

  if (process.env.EXPO_PUBLIC_REDIRECT_ENABLED === 'true') {
    const route = process.env.EXPO_PUBLIC_REDIRECT_ROUTE;
    if (route) return <Redirect href={route} />;
  }

  // if not initialized, show loading spinner
  if (!isInitialized) {
    return <ActivityIndicator />;
  }

  console.log('isAuthenticated', isAuthenticated, 'user', user);

  if (isAuthenticated && user) {
    // if logged in, redirect to home
    return <Redirect href="/servers" />;
  }

  // if not logged in, redirect to login
  return <Redirect href="/login" />;
}
