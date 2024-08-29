import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { colors, fonts } from '@/constants/theme';
import { ServerItemProps } from '@/types';
import MyText from '../MyText';
import { FontAwesome5 } from '@expo/vector-icons';
import useServers from '@/hooks/useServers';
import { useMemo } from 'react';

interface ExtendedServerItemProps extends ServerItemProps {
  name: string;
}

const ExtendedServerItem = ({
  id,
  name,
  onPress = (id) => console.log(id)
}: ExtendedServerItemProps) => {
  const placeholderImg = 'https://via.placeholder.com/150';
  const { servers } = useServers();
  const currentServer = useMemo(
    () => servers.find((server) => server.id === id),
    [servers, id]
  );

  return (
    <TouchableOpacity
      onPress={() => {
        onPress(id);
      }}
    >
      <View style={styles.container}>
        <Image
          source={{
            uri: currentServer?.avatar ?? placeholderImg
          }}
          style={styles.serverImg}
        />
        <MyText
          style={styles.serverName}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {name}
        </MyText>
      </View>
    </TouchableOpacity>
  );
};

export default ExtendedServerItem;

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: 64
  },
  serverImg: {
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
    backgroundColor: colors.gray02
  },
  serverName: {
    alignSelf: 'center',
    fontSize: 12,
    fontFamily: fonts.bold,
    textAlign: 'center',
    lineHeight: 16
  }
});
