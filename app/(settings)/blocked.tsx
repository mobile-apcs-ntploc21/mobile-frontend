import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from 'react';
import GlobalStyles from '@/styles/GlobalStyles';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import { colors } from '@/constants/theme';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { router, useNavigation } from 'expo-router';
import { getBlockedUsers } from '@/services/friend';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyHeader from '@/components/MyHeader';
import { MyButtonText } from '@/components/MyButton';
import MyButtonPress from '@/components/MyButton/MyButtonPress';
import { useAuth } from '@/context/AuthProvider';

const Blocked = () => {
  const [blocked, setBlocked] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  const navigation = useNavigation();

  const fetchBlocked = async () => {
    try {
      const response = await getBlockedUsers();
      setBlocked(response);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await fetchBlocked();
    setLoading(false);
  };

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Settings" />
      )
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator />
        ) : blocked.length === 0 ? (
          <MyText>No blocked users</MyText>
        ) : (
          <ButtonListBase
            heading="Blocked List"
            items={blocked.map((item) => ({
              itemComponent: (
                <View style={styles.itemContainer}>
                  <MyText style={styles.username}>{item.id}</MyText>
                </View>
              ),
              onPress: () => router.navigate(`/user/${item.id}`)
            }))}
          />
        )}
      </View>
      <View style={{ padding: 16 }}>
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

export default Blocked;

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.screen,
    backgroundColor: colors.gray04
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
