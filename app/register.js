import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSignUp, useAuth } from "@clerk/clerk-expo";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import { Colors } from "../constants/Colors";
import { Typography } from "../constants/Typography";

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { signUp } = useSignUp();
  const { getToken } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailRegister = async () => {
    try {
      const result = await signUp.create({ 
        emailAddress: email, 
        password,
        username: username 
      });
      
      // Versuche die Session zu erstellen
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      // Weiterleitung zur Verifizierungsseite
      router.replace("/verify-email");
    } catch (err) {
      const errorMessage = err.message || err.toString();
      
      if (errorMessage.includes("Enter email address")) {
        setError(t("register.error.emailRequired"));
      } else if (errorMessage.includes("Enter username")) {
        setError(t("register.error.usernameRequired"));
      } else if (errorMessage.includes("Enter password")) {
        setError(t("register.error.passwordRequired"));
      } else if (errorMessage.includes("Passwords must be 8 characters or more")) {
        setError(t("register.error.passwordTooShort"));
      } else if (errorMessage.includes("Password has been found in an online data breach")) {
        setError(t("register.error.passwordBreached"));
      } else if (errorMessage.includes("Username can only contain letters, numbers and '_' or '-'")) {
        setError(t("register.error.usernameInvalid"));
      } else if (errorMessage.includes("email_address must be a valid email address")) {
        setError(t("register.error.invalidEmail"));
      } else if (errorMessage.includes("duplicate_email")) {
        setError(t("register.error.emailExists"));
      } else if (errorMessage.includes("duplicate_username")) {
        setError(t("register.error.usernameExists"));
      } else {
        setError(t("register.error.general"));
      }
      console.error("Registrierung fehlgeschlagen:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[Typography.h1]}>{t("register.title")}</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <InputField
        placeholder={t("register.username")}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        iconName="person"
        error={error}
      />
      <InputField
        placeholder={t("register.email")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        iconName="email"
        error={error}
      />
      <InputField
        placeholder={t("register.password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        iconName="lock"
        error={error}
      />

      <CustomButton
        title={t("register.submit")}
        onPress={handleEmailRegister}
        color={Colors.primary}
      />
      <CustomButton
        title={t("register.back")}
        onPress={() => router.back()}
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
});
