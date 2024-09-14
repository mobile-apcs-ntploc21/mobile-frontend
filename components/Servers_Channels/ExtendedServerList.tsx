import { colors, fonts } from '@/constants/theme';
import { ServersActions } from '@/context/ServersProvider';
import useServers from '@/hooks/useServers';
import { putData } from '@/utils/api';
import { COL, HEIGHT, MARGIN_X, MARGIN_Y, WIDTH } from '@/utils/dragging';
import { FontAwesome5 } from '@expo/vector-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Draggable from '../Draggable';
import MyText from '../MyText';
import CreateServerModal from '../modal/CreateServerModal';
import ExtendedServerItem from './ExtendedServerItem';

interface ExtendedServerListProps {
  swipeDown: () => void;
  isFavorite?: boolean;
}

const ExtendedServerList = ({
  swipeDown,
  isFavorite
}: ExtendedServerListProps) => {
  const { servers, dispatch } = useServers();
  const [showModal, setShowModal] = useState(false);
  const positions = useSharedValue<number[]>([]);
  const serverRef = useRef(servers);

  useEffect(() => {
    const filteredServers = servers.filter((server) =>
      isFavorite ? server.is_favorite : true
    );

    const tmp = filteredServers.map((item, index) => index + 1);
    tmp.unshift(0);
    positions.value = tmp;
  }, [servers, isFavorite]);

  useEffect(() => {
    const newServers = [...servers];

    positions.value.forEach((position, index) => {
      if (index > 0) {
        newServers[position - 1] = servers[index - 1];
        newServers[position - 1].position = position - 1;
      }
    });

    dispatch({ type: ServersActions.SET_SERVERS, payload: newServers });
  }, [isFavorite]);

  useEffect(() => {
    serverRef.current = servers;
  }, [servers]);

  // This useEffect will save the server positions to the database.
  // It will run when the component is unmounted.
  useEffect(() => {
    if (isFavorite) return; // Do not save server positions if isFavorite is true

    return () => {
      // Save the server positions to Database
      const newServers = [...serverRef.current];

      positions.value.forEach((position, index) => {
        if (index > 0) {
          newServers[position - 1] = serverRef.current[index - 1];
          newServers[position - 1].position = position - 1;
        }
      });

      dispatch({ type: ServersActions.SET_SERVERS, payload: newServers });

      const serverPositions = newServers.map((server) => ({
        server_id: server.id,
        position: server.position
      }));

      const saveServerPositions = async () => {
        try {
          const response = await putData('/api/v1/servers/move', {
            servers: serverPositions
          });

          if (!response) {
            throw new Error('Failed to save server positions.');
          }

          console.log('Server positions saved successfully.');
        } catch (err: any) {
          console.error(err);
        }
      };

      saveServerPositions();
    };
  }, []);

  const handleCloseModal = (isWithNewServer?: boolean) => {
    setShowModal(false);
    if (isWithNewServer) {
      swipeDown();
    }
  };

  const handleRenderServer = () => {
    const filteredServers = servers.filter((server) =>
      isFavorite ? server.is_favorite : true
    );

    return filteredServers.map((item, index) => (
      <Draggable key={item.id} id={index + 1} positions={positions}>
        <ExtendedServerItem
          {...item}
          onPress={() => {
            dispatch({ type: ServersActions.SELECT_SERVER, payload: item.id });
            swipeDown();
          }}
        />
      </Draggable>
    ));
  };

  return (
    <BottomSheetScrollView
      style={styles.container}
      contentContainerStyle={{
        alignItems: 'center'
      }}
      nestedScrollEnabled
    >
      <CreateServerModal visible={showModal} onClose={handleCloseModal} />
      <View
        style={{
          height: Math.ceil((servers.length + 1) / COL) * (HEIGHT + MARGIN_Y),
          paddingBottom: MARGIN_Y,
          backgroundColor: 'blue'
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: COL * (WIDTH + MARGIN_X) + MARGIN_X
        }}
      >
        <Draggable key={'create-server'} id={0} positions={positions}>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => setShowModal(true)}
          >
            <View style={styles.btnAdd}>
              <FontAwesome5 name="plus" size={28} color={colors.primary} />
            </View>
            <MyText
              style={styles.textBtn}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Create Server
            </MyText>
          </TouchableOpacity>
        </Draggable>
        {handleRenderServer()}
      </View>
    </BottomSheetScrollView>
  );
};

export default ExtendedServerList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -16,
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
