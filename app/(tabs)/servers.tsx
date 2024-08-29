import { Image } from 'expo-image';
import { useMemo } from 'react';
import ServerList from '@/components/Servers_Channels/ServerList';
import { DefaultCoverImage } from '@/constants/images';
import { colors } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';
import ServerInfo from '../../components/Servers_Channels/ServerInfo';
import useServers from '@/hooks/useServers';

export default function Servers() {
  const { servers, currentServerId } = useServers();
  const thisServer = useMemo(
    () => servers.find((server) => server.id === currentServerId),
    [servers, currentServerId]
  );

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={
          thisServer?.banner ? { uri: thisServer.banner } : DefaultCoverImage
        }
        style={styles.coverimg}
      />
      <View style={styles.container}>
        <ServerInfo />
      </View>
      <ServerList />
    </View>
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
