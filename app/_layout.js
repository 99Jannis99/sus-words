import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../lib/i18n";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../constants/Colors";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

// Splash Screen anzeigen bis Fonts geladen sind
SplashScreen.preventAutoHideAsync();

const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function Layout() {
  const [fontsLoaded] = useFonts({
    "Montserrat-Thin": require("../assets/fonts/static/Montserrat-Thin.ttf"),
    "Montserrat-ThinItalic": require("../assets/fonts/static/Montserrat-ThinItalic.ttf"),
    "Montserrat-ExtraLight": require("../assets/fonts/static/Montserrat-ExtraLight.ttf"),
    "Montserrat-ExtraLightItalic": require("../assets/fonts/static/Montserrat-ExtraLightItalic.ttf"),
    "Montserrat-Light": require("../assets/fonts/static/Montserrat-Light.ttf"),
    "Montserrat-LightItalic": require("../assets/fonts/static/Montserrat-LightItalic.ttf"),
    "Montserrat-Regular": require("../assets/fonts/static/Montserrat-Regular.ttf"),
    "Montserrat-Italic": require("../assets/fonts/static/Montserrat-Italic.ttf"),
    "Montserrat-Medium": require("../assets/fonts/static/Montserrat-Medium.ttf"),
    "Montserrat-MediumItalic": require("../assets/fonts/static/Montserrat-MediumItalic.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/static/Montserrat-SemiBold.ttf"),
    "Montserrat-SemiBoldItalic": require("../assets/fonts/static/Montserrat-SemiBoldItalic.ttf"),
    "Montserrat-Bold": require("../assets/fonts/static/Montserrat-Bold.ttf"),
    "Montserrat-BoldItalic": require("../assets/fonts/static/Montserrat-BoldItalic.ttf"),
    "Montserrat-ExtraBold": require("../assets/fonts/static/Montserrat-ExtraBold.ttf"),
    "Montserrat-ExtraBoldItalic": require("../assets/fonts/static/Montserrat-ExtraBoldItalic.ttf"),
    "Montserrat-Black": require("../assets/fonts/static/Montserrat-Black.ttf"),
    "Montserrat-BlackItalic": require("../assets/fonts/static/Montserrat-BlackItalic.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider
      onLayout={onLayoutRootView}
      backgroundColor={Colors.background}
    >
      <ClerkProvider publishableKey={clerkKey}>
        <StatusBar backgroundColor={Colors.background} style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: Colors.background,
              fontFamily: "Montserrat-Regular",
            },
          }}
        />
        <Toast />
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
