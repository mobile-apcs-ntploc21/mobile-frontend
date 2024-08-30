import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import MyHeader from '@/components/MyHeader';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { colors } from '@/constants/theme';
import ButtonListText from '@/components/ButtonList/ButtonListText';

const Move = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Move to Category" />
      )
    });
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: colors.gray04 }}>
      <View style={styles.container}>
        <ButtonListText
          items={[
            {
              text: 'Uncategorized',
              onPress: () => {}
            },
            {
              text: 'Category 1',
              onPress: () => {}
            },
            {
              text: 'Category 2',
              onPress: () => {}
            },
            {
              text: 'Category 3',
              onPress: () => {}
            }
          ]}
        />
      </View>
    </View>
  );
};

export default Move;

const styles = StyleSheet.create({
  container: {
    padding: 16
  }
});
