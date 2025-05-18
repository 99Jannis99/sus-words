import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSignUp } from "@clerk/clerk-expo";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import { Colors } from "../constants/Colors";
import { Typography } from "../constants/Typography";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { signUp } = useSignUp();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerifyEmail = async () => {
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        router.replace("/LobbyScreen");
      }
    } catch (err) {
      const errorMessage = err.message || err.toString();
      
      if (errorMessage.includes("Too many failed attempts")) {
        setError(t("verifyEmail.error.tooManyAttempts"));
      } else if (errorMessage.includes("Incorrect code")) {
        setError(t("verifyEmail.error.incorrectCode"));
      } else if (errorMessage.includes("Invalid code")) {
        setError(t("verifyEmail.error.invalidCode"));
      } else if (errorMessage.includes("Code expired")) {
        setError(t("verifyEmail.error.codeExpired"));
      } else {
        setError(t("verifyEmail.error.general"));
      }
      console.error("Verifizierung fehlgeschlagen:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[Typography.h1]}>{t("verifyEmail.title")}</Text>
        <Text style={styles.subtitle}>{t("verifyEmail.subtitle")}</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <InputField
        placeholder={t("verifyEmail.code")}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        autoCapitalize="none"
        iconName="key"
        error={error}
      />

      <CustomButton
        title={t("verifyEmail.submit")}
        onPress={handleVerifyEmail}
        color={Colors.primary}
      />
      <CustomButton
        title={t("verifyEmail.back")}
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
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 10,
    color: Colors.textSecondary
  },
  errorText: {
    color: Colors.error,
  },
}); 