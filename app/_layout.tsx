import { useFonts } from 'expo-font';
import { Stack, Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlobalProvider from '@/context/GlobalProvider';
import { AuthProvider } from '@/context/AuthProvider';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WsProvider from '@/context/WsProvider';
import UserProvider from '@/context/UserProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index'
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
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <AuthProvider>
          <WsProvider>
            <UserProvider>
              <GlobalProvider>
                <SafeAreaView style={{ flex: 1 }}>
                  <Stack>
                    <Stack.Screen
                      name="(auth)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="modal"
                      options={{ presentation: 'modal' }}
                    />
                    <Stack.Screen
                      name="user/[userId]"
                      options={{ headerShown: false }}
                    />
                  </Stack>
                </SafeAreaView>
              </GlobalProvider>
            </UserProvider>
          </WsProvider>
        </AuthProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
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
