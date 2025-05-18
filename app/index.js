import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../lib/store';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

export default function StartScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState('');
  const { setUser } = useAuthStore();

  const handleGuestStart = () => {
    if (!name.trim()) return;
    setUser({ username: name, isGuest: true });
    router.push('/HomeScreen'); // Gehe zu HomeScreen
  };

  const handleLogin = () => {
    router.push('/login'); // Optional: Login Screen via Clerk
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[Typography.h1]}>{t('welcome')}</Text>
      </View>

      <InputField
        placeholder={t('enterName')}
        value={name}
        onChangeText={setName}
        iconName="person"
      />

      <View style={styles.buttonContainer}>
        <CustomButton 
          title={t('playAsGuest')} 
          onPress={handleGuestStart}
          color={Colors.primary}
        />
        <CustomButton 
          title={t('login.title')} 
          onPress={handleLogin}
          color={Colors.secondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 10
  }
});
