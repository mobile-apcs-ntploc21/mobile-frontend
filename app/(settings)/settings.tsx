import ButtonListText from '@/components/ButtonList/ButtonListText';
import { MyButtonText } from '@/components/MyButton';
import MyButtonPress from '@/components/MyButton/MyButtonPress';
import MyHeader from '@/components/MyHeader';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useConversations } from '@/context/ConversationsProvider';
import useServer from '@/hooks/useServer';
import useServers from '@/hooks/useServers';
import { TextStyles } from '@/styles/TextStyles';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { router, useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Conversation, ConversationsTypes } from '@/types/chat';
import { useNotification } from '@/services/alert';

const Settings = () => {
  const { logout } = useAuth();
  const { dispatch: serversDispatch } = useServers();
  const { dispatch: conversationsDispatch } = useConversations();
  const { unsubscribeServer } = useServer();
  const { showAlert } = useNotification();

  const unavailableService = useCallback(() => {
    showAlert('Service is unavailable at the moment.');
  }, [showAlert]);

  const navigation = useNavigation();

  const handleLogout = useCallback(() => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          (async () => {
            // Log out user and navigate to login screen
            await logout();
            router.dismissAll();

            // Delete all data
            serversDispatch({ type: 'SET_SERVERS', payload: [] });
            unsubscribeServer(null);
            conversationsDispatch({
              type: ConversationsTypes.SetConversation,
              payload: {
                conversation: [] as unknown as Conversation
              }
            });
          })().catch(console.error);
        }
      }
    ]);
  }, [logout]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Settings" />
      )
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: 16,
          gap: 16
        }}
      >
        <ButtonListText
          heading="Account Settings"
          items={[
            {
              text: 'Change password',
              onPress: unavailableService
            },
            {
              text: 'Blocked list',
              onPress: () => router.push('/blocked')
            }
          ]}
        />
        <ButtonListText
          heading="App Settings"
          items={[
            {
              text: 'Notifications',
              onPress: unavailableService
            }
          ]}
        />
        <ButtonListText
          heading="Billing Settings"
          items={[
            {
              text: 'Premium management',
              onPress: () => router.push('/premium')
            }
          ]}
        />
      </ScrollView>
      <View style={{ marginBottom: 16, marginHorizontal: 16 }}>
        <MyButtonPress
          comp={(props) => (
            <MyButtonText
              {...props}
              activeOpacity={1}
              containerStyle={{ width: '100%' }}
              title="Log Out"
              backgroundColor={colors.semantic_red}
              textColor={colors.white}
              onPress={handleLogout}
            />
          )}
        />
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16
  },
  body: {
    flex: 1,
    padding: 16
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  username: {
    ...TextStyles.h5,
    marginLeft: 8
  }
});
