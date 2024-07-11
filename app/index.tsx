import { Redirect } from 'expo-router';

export default function Index() {
  const redirect = process.env.EXPO_PUBLIC_INDEX_REDIRECT;
  if (redirect) return <Redirect href={redirect} />;
  return <Redirect href="/servers" />;
}
