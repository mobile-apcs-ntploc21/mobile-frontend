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

const ServerList = () => {
  const ref = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['13.5%', '95%'], []);
  const [servers, setServers] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i.toString(),
      name: `Server ${i}`
    }))
  );

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
          renderItem={() => <View style={styles.serverImg} />}
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
  serverImg: {
    marginLeft: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray02
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
