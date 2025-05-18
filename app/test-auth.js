import { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useUser, useSession, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function TestAuthScreen() {
  const { user, isLoaded: userLoaded } = useUser();
  const { session } = useSession();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userLoaded && isSignedIn && session) {
      console.log("✅ Eingeloggt:", {
        userId: user?.id,
        sessionId: session?.id,
        email: user?.primaryEmailAddress?.emailAddress
      });

      setTimeout(() => {
        router.replace("/LobbyScreen");
      }, 2000); // Nur zu Testzwecken: nach 2 Sek. weiterleiten
    }
  }, [userLoaded, isSignedIn, session]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Test Auth Status</Text>
      {!userLoaded && <ActivityIndicator size="large" />}
      {userLoaded && (
        <>
          <Text style={styles.text}>Signed In: {String(isSignedIn)}</Text>
          <Text style={styles.text}>User ID: {user?.id}</Text>
          <Text style={styles.text}>Email: {user?.primaryEmailAddress?.emailAddress}</Text>
          <Text style={styles.text}>Session ID: {session?.id}</Text>
          <Text style={styles.note}>Du wirst gleich weitergeleitet...</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  note: {
    marginTop: 12,
    fontStyle: "italic",
    color: "gray",
  },
});
