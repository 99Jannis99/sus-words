import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useTranslation } from "react-i18next";
import { useWarmUpBrowser } from "../lib/useWarmUpBrowser";
import { useOAuth, useSignIn, useAuth, useSession } from "@clerk/clerk-expo";
import * as WebBrowser from 'expo-web-browser';
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import { Typography } from "../constants/Typography";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
} from "@expo/vector-icons";
import { Colors } from "../constants/Colors";

export default function LoginScreen() {
  useWarmUpBrowser();
  const router = useRouter();
  const segments = useSegments();
  const { t } = useTranslation();
  const { signIn } = useSignIn();
  const { isSignedIn } = useAuth();
  const { session } = useSession();
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ 
    strategy: "oauth_google",
    redirectUrl: "sus-words://oauth-native-callback"
  });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ 
    strategy: "oauth_apple",
    redirectUrl: "sus-words://oauth-native-callback"
  });
  const { startOAuthFlow: startDiscordOAuth } = useOAuth({ 
    strategy: "oauth_discord",
    redirectUrl: "sus-words://oauth-native-callback"
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      console.log('Checking session status:', {
        isSignedIn,
        hasSession: !!session,
        sessionId: session?.id
      });

      if (isSignedIn && session) {
        console.log('User is signed in with valid session, redirecting to lobby...');
        router.replace("/LobbyScreen");
      }
    };

    checkSession();
  }, [isSignedIn, session]);

  useEffect(() => {
    // Beende den WebBrowser wenn die Komponente unmounted wird
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const handleOAuth = async (startOAuthFlow, provider) => {
    try {
      console.log(`Starting ${provider} OAuth flow...`);
      const { createdSessionId, signIn, signUp } = await startOAuthFlow();
      
      console.log('OAuth response:', { 
        createdSessionId, 
        signInStatus: signIn?.status,
        signUpStatus: signUp?.status,
        currentSegments: segments
      });
      
      if (createdSessionId) {
        // Warte kurz, damit die Session initialisiert werden kann
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (session) {
          console.log('Session initialized, redirecting to lobby...');
          router.replace("/LobbyScreen");
        } else {
          console.log('Session not initialized yet, waiting...');
          // Warte auf Session-Initialisierung
          const checkSession = setInterval(async () => {
            if (session) {
              clearInterval(checkSession);
              console.log('Session now initialized, redirecting to lobby...');
              router.replace("/LobbyScreen");
            }
          }, 500);
          
          // Timeout nach 10 Sekunden
          setTimeout(() => {
            clearInterval(checkSession);
            console.log('Session initialization timeout');
            setError(t("login.error.sessionTimeout"));
          }, 10000);
        }
      }
    } catch (err) {
      const errorMessage = err.message || err.toString();
      console.log('OAuth error details:', {
        error: err,
        message: errorMessage,
        segments: segments
      });
      
      if (errorMessage.includes("cancelled")) {
        setError(t("login.error.oauthCancelled"));
      } else if (errorMessage.includes("network")) {
        setError(t("login.error.network"));
      } else if (errorMessage.includes("already signed in")) {
        console.log('User already signed in, redirecting to lobby...');
        router.replace("/LobbyScreen");
      } else {
        setError(t("login.error.general"));
      }
      console.error(`${provider} Login fehlgeschlagen:`, err);
    }
  };

  const handleEmailLogin = async () => {
    try {
      const result = await signIn.create({ identifier: email, password });
      console.log('Email login result:', result);
      
      if (result.status === "complete") {
        console.log('Email login complete, redirecting to lobby...');
        router.replace("/LobbyScreen");
      }
    } catch (err) {
      const errorMessage = err.message || err.toString();
      
      if (errorMessage.includes("Password is incorrect")) {
        setError(t("login.error.incorrectPassword"));
      } else if (errorMessage.includes("identifier_not_found")) {
        setError(t("login.error.invalidCredentials"));
      } else if (errorMessage.includes("Enter password")) {
        setError(t("login.error.passwordRequired"));
      } else if (errorMessage.includes("Enter email")) {
        setError(t("login.error.emailRequired"));
      } else {
        setError(t("login.error.general"));
      }
      console.error("Login fehlgeschlagen:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[Typography.h1]}>{t("login.title")}</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.socialButtonsContainer}>
        <CustomButton
          icon={{
            type: "FontAwesome5",
            name: "google",
            size: 30,
          }}
          onPress={() => handleOAuth(startGoogleOAuth, "Google")}
          style={styles.oauthButton}
          color="#DB4437"
        />
        <CustomButton
          icon={{
            type: "AntDesign",
            name: "apple1",
            size: 30,
          }}
          onPress={() => handleOAuth(startAppleOAuth, "Apple")}
          style={styles.oauthButton}
          color={Colors.text}
        />
        <CustomButton
          icon={{
            type: "MaterialIcons",
            name: "discord",
            size: 30,
          }}
          onPress={() => handleOAuth(startDiscordOAuth, "Discord")}
          style={styles.oauthButton}
          color="#7289DA"
        />
      </View>

      <InputField
        placeholder={t("login.email")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        iconName="email"
        error={error}
      />
      <InputField
        placeholder={t("login.password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        iconName="lock"
        error={error}
      />

      <CustomButton
        title={t("login.loginEmail")}
        onPress={handleEmailLogin}
        color={Colors.primary}
      />
      <CustomButton
        title={t("login.register")}
        onPress={() => router.push("/register")}
        color={Colors.secondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  errorText: {
    color: Colors.error,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  oauthButton: {
    borderRadius: 24,
    width: "auto",
  },
});
