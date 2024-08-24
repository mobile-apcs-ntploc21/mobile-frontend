import ServerList from '@/components/Servers_Channels/ServerList';
import { DefaultCoverImage } from '@/constants/images';
import { colors } from '@/constants/theme';
import { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { ServersProvider } from '@/context/ServersProvider';
import { useFocusEffect } from 'expo-router';
import ServerInfo from '../../components/Servers_Channels/ServerInfo';

export default function Servers() {
  return (
    <ServersProvider>
      <View style={{ flex: 1 }}>
        <Image source={DefaultCoverImage} style={styles.coverimg} />
        <View style={styles.container}>
          <ServerInfo />
        </View>
        <ServerList />
      </View>
    </ServersProvider>
  );
}

const styles = StyleSheet.create({
  coverimg: {
    width: '100%',
    height: 177
  },
  container: {
    position: 'absolute',
    width: '100%',
    top: 136,
    bottom: 0,
    backgroundColor: colors.gray04,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  }
});
