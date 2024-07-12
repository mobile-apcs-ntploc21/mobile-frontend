import { useFonts } from 'expo-font';
import { Stack, Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlobalProvider from '@/context/GlobalProvider';
import { AuthProvider } from '@/context/AuthProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)'
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    NRegular: require('../assets/fonts/Nunito-Regular.ttf'),
    NMedium: require('../assets/fonts/Nunito-Medium.ttf'),
    NBold: require('../assets/fonts/Nunito-Bold.ttf'),
    NBlack: require('../assets/fonts/Nunito-Black.ttf')
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </SafeAreaView>
      </GlobalProvider>
    </AuthProvider>
  );
}

// function RootLayoutNav() {
//   return (
//     <GlobalProvider>
//       <SafeAreaView style={{ flex: 1 }}>
//         <Stack>
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//           <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
//         </Stack>
//       </SafeAreaView>
//     </GlobalProvider>
//   );
// }
