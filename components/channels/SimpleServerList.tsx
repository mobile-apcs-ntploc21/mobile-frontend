import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ServerListProps } from '@/types';
import SimpleServerItem from './SimpleServerItem';

interface SimpleServerListProps extends ServerListProps {}

const SimpleServerList = (props: SimpleServerListProps) => {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={props.servers.slice(1)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginLeft: 8 }}>
            <SimpleServerItem
              id={item.id}
              selected={item.id === props.currentServerId}
              onPress={props.onChange}
            />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default SimpleServerList;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 7
  }
});
