import { Image } from 'expo-image';
import { useMemo, useRef } from 'react';
import ServerList from '@/components/Servers_Channels/ServerList';
import { DefaultCoverImage } from '@/constants/images';
import { colors } from '@/constants/theme';
import { Animated, StyleSheet, Text, View } from 'react-native';
import ServerInfo from '../../components/Servers_Channels/ServerInfo';
import useServers from '@/hooks/useServers';

export default function Servers() {
  const { servers, serverMap, currentServerId } = useServers();
  const scrollY = useRef(new Animated.Value(0)).current;
  const thisServer = useMemo(
    () => (currentServerId !== null ? serverMap[currentServerId] : null),
    [serverMap, currentServerId]
  );

  const topInterpolate = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [136, 0],
    extrapolate: 'clamp'
  });

  const radiusInterpolate = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [30, 0],
    extrapolate: 'clamp'
  });

  const handleServerScreen = () => {
    if (servers && servers.length > 0 && thisServer) {
      return (
        <View style={{ flex: 1 }}>
          <Animated.Image
            source={
              thisServer?.banner
                ? { uri: thisServer.banner }
                : DefaultCoverImage
            }
            style={{
              ...styles.coverimg
            }}
          />
          <Animated.View
            style={[
              styles.container,
              {
                top: topInterpolate,
                borderTopLeftRadius: radiusInterpolate,
                borderTopRightRadius: radiusInterpolate
              }
            ]}
          >
            <ServerInfo scrollY={scrollY} />
          </Animated.View>
        </View>
      );
    }

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 30
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
          No server found
        </Text>
        <Text style={{ fontSize: 20, textAlign: 'center' }}>
          Join any server or create server to get started.
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray04 }}>
      {handleServerScreen()}
      <ServerList />
    </View>
  );
}

const styles = StyleSheet.create({
  coverimg: {
    position: 'absolute',
    width: '100%',
    height: 177
  },
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    top: 136,
    backgroundColor: colors.gray04,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  }
});
