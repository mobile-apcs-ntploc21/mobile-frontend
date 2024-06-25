import { Redirect } from "expo-router";

export default function Index() {
  // if not logged in, redirect to login
  return <Redirect href="/servers" />;
}
