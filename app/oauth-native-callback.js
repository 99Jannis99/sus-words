import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth, useSession } from "@clerk/clerk-expo";
import { Text, View, ActivityIndicator } from "react-native";

export default function OAuthRedirectHandler() {
  const { isSignedIn } = useAuth();
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isSignedIn && session) {
        router.replace("/test-auth");
      } else {
        router.replace("/login");
      }
    }, 1000); // etwas warten, bis Session geladen ist

    return () => clearTimeout(timer);
  }, [isSignedIn, session]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text>Authentifizierung läuft...</Text>
    </View>
  );
}
