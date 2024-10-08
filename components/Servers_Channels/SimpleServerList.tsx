import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ServerListProps } from '@/types';
import SimpleServerItem from './SimpleServerItem';
import useServers from '@/hooks/useServers';
import { FlatList } from 'react-native-gesture-handler';
import { ServersActions } from '@/context/ServersProvider';

const SimpleServerList = () => {
  const { servers, currentServerId, dispatch } = useServers();

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={servers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View
            style={{
              marginLeft: 8,
              marginRight: index === servers.length - 1 ? 8 : 0
            }}
          >
            <SimpleServerItem
              id={item.id}
              selected={item.id === currentServerId}
              onPress={() => {
                if (item.id === currentServerId) return;

                dispatch({
                  type: ServersActions.SELECT_SERVER,
                  payload: item.id
                });
              }}
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
    paddingBottom: 7,
    paddingLeft: 8,
    paddingRight: 8
  }
});
