import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { ServerListProps } from '@/types';
import SimpleServerItem from './SimpleServerItem';
import ExtendedServerItem from './ExtendedServerItem';
import Draggable from '../Draggable';
import { useSharedValue } from 'react-native-reanimated';
import useServers from '@/hooks/useServers';
import { colors, fonts } from '@/constants/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import MyText from '../MyText';
import { template } from '@babel/core';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { COL, HEIGHT, MARGIN_Y } from '@/utils/dragging';

interface ExtendedServerListProps {
  swipeDown: () => void;
}

const ExtendedServerList = ({ swipeDown }: ExtendedServerListProps) => {
  const { servers, selectServer, setServers } = useServers();
  const positions = useSharedValue<number[]>([]);

  useEffect(() => {
    const tmp = servers.map((item, index) => index + 1);
    tmp.unshift(0);
    positions.value = tmp;
  }, [servers]);

  useEffect(
    () => () => {
      const newServers = [...servers];

      positions.value.forEach((position, index) => {
        if (index > 0) newServers[position - 1] = servers[index - 1];
      });

      setServers(newServers);
    },
    []
  );

  return (
    <BottomSheetScrollView style={styles.container}>
      <View
        style={{
          height: Math.ceil(servers.length / COL) * (HEIGHT + MARGIN_Y),
          paddingBottom: MARGIN_Y
        }}
      />
      <Draggable key={'create-server'} id={0} positions={positions}>
        <TouchableOpacity style={styles.btnContainer} onPress={() => {}}>
          <View style={styles.btnAdd}>
            <FontAwesome5 name="plus" size={28} color={colors.primary} />
          </View>
          <MyText style={styles.textBtn} numberOfLines={2} ellipsizeMode="tail">
            Create Server
          </MyText>
        </TouchableOpacity>
      </Draggable>
      {servers.map((item, index) => (
        <Draggable key={item.id} id={index + 1} positions={positions}>
          <ExtendedServerItem
            {...item}
            onPress={() => {
              selectServer(item.id);
              swipeDown();
            }}
          />
        </Draggable>
      ))}
    </BottomSheetScrollView>
  );
};

export default ExtendedServerList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -16,
    marginHorizontal: 16,
    marginBottom: 16
  },
  btnAdd: {
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.primary,
    borderStyle: 'dashed'
  },
  textBtn: {
    alignSelf: 'center',
    fontSize: 12,
    fontFamily: fonts.bold
  },
  btnContainer: {
    gap: 8,
    width: 64
  }
});
