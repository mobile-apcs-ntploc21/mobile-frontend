import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import GlobalStyles from '@/styles/GlobalStyles';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import { colors } from '@/constants/theme';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { router, useNavigation } from 'expo-router';
import { getBlockedUsers } from '@/services/friend';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyHeader from '@/components/MyHeader';

const Blocked = () => {
  const [blocked, setBlocked] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Blocked List" />
      )
    });
  }, []);

  return (
    <View style={GlobalStyles.screen}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator />
        ) : blocked.length === 0 ? (
          <MyText>No blocked users</MyText>
        ) : (
          <ButtonListBase
            heading="Blocked List"
            items={blocked.map((item, index) => ({
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
    </View>
  );
};

export default Blocked;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray04,
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
