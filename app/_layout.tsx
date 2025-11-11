/* eslint-disable import/no-unresolved */
import { GlobalBottomSheetProvider } from '@/components/GlobalBottomSheetProvider';
import { store } from '@/store';
import { theme } from '@/theme';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components/native';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ headerShown: true, title: 'Product Details' }} />
      <Stack.Screen name="order-confirmation" options={{ headerShown: true, title: 'Order Confirmation' }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GlobalBottomSheetProvider>
          <RootLayoutNav />
          </GlobalBottomSheetProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </Provider>
  );
}
