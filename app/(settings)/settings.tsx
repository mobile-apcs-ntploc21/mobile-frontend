import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from 'react';
import { colors } from '@/constants/theme';
import { TextStyles } from '@/styles/TextStyles';
import { router, useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyHeader from '@/components/MyHeader';
import { MyButtonText } from '@/components/MyButton';
import MyButtonPress from '@/components/MyButton/MyButtonPress';
import { useAuth } from '@/context/AuthProvider';
import ButtonListText from '@/components/ButtonList/ButtonListText';

const Settings = () => {
  const { logout } = useAuth();
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
        onPress: logout
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
        contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 16 }}
      >
        <ButtonListText
          items={[
            {
              text: 'Blocked list',
              onPress: () => router.push('/blocked')
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
