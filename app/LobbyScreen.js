import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useUser, useAuth, useSession } from "@clerk/clerk-expo";
import {
  Backdrop,
  BackdropSubheader,
  AppBar,
  IconButton,
  Avatar,
  Button,
} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "../constants/Colors";
import { Typography } from "../constants/Typography";

export default function LobbyScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const { session } = useSession();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoaded) {
        console.log('Checking auth status...', {
          isLoaded,
          isSignedIn,
          hasSession: !!session,
          sessionId: session?.id
        });

        if (!isSignedIn || !session) {
          try {
            // Versuche die Session zu beenden
            if (session) {
              await session.end();
            }
            console.log('Redirecting to login...');
            router.replace('/login');
          } catch (error) {
            console.error('Error handling auth state:', error);
            // Bei einem Fehler trotzdem zur Login-Seite
            router.replace('/login');
          }
        }
      }
    };

    checkAuth();
  }, [isLoaded, isSignedIn, session]);

  console.log('Auth Status:', {
    isLoaded,
    isSignedIn,
    user: user ? {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      email: user.primaryEmailAddress?.emailAddress,
    } : null
  });

  if (!isLoaded) {
    return null; // oder einen Ladebildschirm anzeigen
  }

  const handleAvatarPress = () => {
    setRevealed(true);
  };

  const handleCloseBackdrop = () => {
    setRevealed(false);
  };

  const handleFriendsPress = () => {
    router.push("/friends");
    setRevealed(false);
  };

  const handleCreateGroup = () => {
    router.push("/lobby/create");
  };

  const handleJoinGroup = () => {
    router.push("/lobby/join");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Backdrop
        revealed={revealed}
        header={
          <AppBar
            transparent
            style={styles.appBar}
            leading={props => (
              <IconButton
                icon={props => (
                  <Avatar
                    image={{ uri: user?.imageUrl || "https://mui.com/static/images/avatar/1.jpg" }}
                    size={40}
                    onPress={handleAvatarPress}
                  />
                )}
                {...props}
              />
            )}
          />
        }
        backLayer={
          <View style={styles.backLayer}>
            <View style={styles.profileInfo}>
              <Avatar
                image={{ uri: user?.imageUrl || "https://mui.com/static/images/avatar/1.jpg" }}
                size={80}
              />
              <Text style={styles.username}>{user?.username || user?.firstName || "Benutzer"}</Text>
              <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress || "Keine E-Mail"}</Text>
            </View>
            <Button
              title={t("lobby.friends")}
              onPress={handleFriendsPress}
              style={styles.friendsButton}
              color={Colors.primary}
            />
            <IconButton
              icon={props => <Icon name="close" {...props} />}
              onPress={handleCloseBackdrop}
              style={styles.closeButton}
            />
          </View>
        }
      >
        <BackdropSubheader title={t("lobby.title")} />
        <View style={styles.content}>
          <Button
            title={t("lobby.createGroup")}
            onPress={handleCreateGroup}
            style={styles.button}
            color={Colors.primary}
          />
          <Button
            title={t("lobby.joinGroup")}
            onPress={handleJoinGroup}
            style={styles.button}
            color={Colors.secondary}
          />
        </View>
      </Backdrop>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backLayer: {
    height: 300,
    padding: 20,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    ...Typography.h2,
    marginTop: 10,
  },
  email: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  friendsButton: {
    marginTop: 20,
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },
  button: {
    width: '100%',
  },
});
  