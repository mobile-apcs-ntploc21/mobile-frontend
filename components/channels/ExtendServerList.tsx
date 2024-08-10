import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ServerListProps } from '@/types';
import SimpleServerItem from './SimpleServerItem';
import ExtendServerItem from './ExtendServerItem';

interface ExtendServerListProps extends ServerListProps {}

const ExtendServerList = (props: ExtendServerListProps) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={props.servers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ margin: 16 }}>
            <ExtendServerItem id={item.id} onPress={props.onChange} />
          </View>
        )}
        numColumns={4}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default ExtendServerList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  }
});
