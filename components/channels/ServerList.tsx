import React, { useRef, useMemo, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  LayoutChangeEvent
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { colors } from '@/constants/theme';
import MyText from '../MyText';
import SimpleServerItem from './SimpleServerItem';

const ServerList = () => {
  const ref = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['13.5%', '95%'], []);
  const [servers, setServers] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i.toString(),
      name: `Server ${i}`
    }))
  );
  const [currentServer, setCurrentServer] = useState(servers[0]);

  const handlePress = (id: string) => {
    if (id !== currentServer.id)
      setCurrentServer(servers.find((server) => server.id === id)!);
  };

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      handleComponent={() => <View style={styles.handle} />}
      backgroundStyle={{ backgroundColor: colors.gray03 }}
      enableContentPanningGesture={false}
    >
      <View style={styles.container}>
        <FlatList
          horizontal
          data={servers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginLeft: 8 }}>
              <SimpleServerItem
                id={item.id}
                selected={item.id === currentServer.id}
                onPress={handlePress}
              />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 7
  },
  handle: {
    marginTop: 5,
    marginBottom: 13,
    width: 39,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray01,
    alignSelf: 'center'
  }
});

export default ServerList;
