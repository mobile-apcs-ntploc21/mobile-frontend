import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ServerListProps } from '@/types';
import SimpleServerItem from './SimpleServerItem';
import useServers from '@/hooks/useServers';

const SimpleServerList = () => {
  const { servers, currentServerIndex, selectServer } = useServers();
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={servers.slice(1)}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={{ marginLeft: 8 }}>
            <SimpleServerItem
              id={item.id}
              selected={index + 1 === currentServerIndex}
              onPress={() => selectServer(index + 1)}
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
