import React, { useRef, useMemo, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  LayoutChangeEvent
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { colors, fonts } from '@/constants/theme';
import MyText from '../MyText';
import SimpleServerItem from './SimpleServerItem';
import SimpleServerList from './SimpleServerList';
import ExtendedServerList from './ExtendedServerList';
import Toggle from '../Toggle';

const ServerList = () => {
  const ref = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['13.5%', '95%'], []);
  const [servers, setServers] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i.toString(),
      name: i > 0 ? `Server ${i}` : 'Create Server'
    }))
  );
  const [currentServer, setCurrentServer] = useState(servers[1]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePress = (id: string) => {
    if (id !== currentServer.id)
      setCurrentServer(servers.find((server) => server.id === id)!);
  };

  const handleSheetChanges = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      handleComponent={() => <View style={styles.handle} />}
      backgroundStyle={{ backgroundColor: colors.gray03 }}
      enableContentPanningGesture={false}
      onChange={handleSheetChanges}
    >
      {currentIndex === 0 ? (
        <SimpleServerList
          servers={servers}
          onChange={handlePress}
          currentServerId={currentServer.id}
        />
      ) : (
        <ExtendedServerList
          servers={servers}
          onChange={handlePress}
          currentServerId={currentServer.id}
        />
      )}
      {currentIndex === 1 && (
        <View style={styles.toggleContainer}>
          <Toggle
            FirstFC={({ isSelected }) => (
              <MyText
                style={[
                  styles.toggleText,
                  {
                    color: isSelected ? colors.primary : colors.white
                  }
                ]}
              >
                All Servers
              </MyText>
            )}
            SecondFC={({ isSelected }) => (
              <MyText
                style={[
                  styles.toggleText,
                  {
                    color: isSelected ? colors.primary : colors.white
                  }
                ]}
              >
                Favorite Servers
              </MyText>
            )}
          />
        </View>
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  handle: {
    marginTop: 5,
    marginBottom: 13,
    width: 39,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray01,
    alignSelf: 'center'
  },
  toggleText: {
    fontSize: 15,
    fontFamily: fonts.bold
  },
  toggleContainer: {
    marginHorizontal: 'auto',
    marginBottom: 16
  }
});

export default ServerList;
