import { StyleSheet, View } from 'react-native';
import { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import SearchBar from '@/components/SearchBar';
import GlobalStyles from '@/styles/GlobalStyles';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import MyHeader from '@/components/MyHeader';
import UserBanItem from '@/components/userManagment/UserBanItem';

const Bans = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Bans" />
      )
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={GlobalStyles.container}>
        <View style={styles.searchContainer}>
          <View style={{ flex: 1 }}>
            <SearchBar />
          </View>
        </View>
        <ButtonListBase
          scrollable
          items={Array.from({ length: 20 }, (_, index) => ({
            itemComponent: <UserBanItem />,
            onPress: () => console.log(`Item ${index} pressed`)
          }))}
        />
      </View>
    </View>
  );
};

export default Bans;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 16
  }
});
