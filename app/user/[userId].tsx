import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const UserById = () => {
  const { userId } = useLocalSearchParams();
  return (
    <View>
      <Text>{userId}</Text>
    </View>
  );
};

export default UserById;

const styles = StyleSheet.create({});
