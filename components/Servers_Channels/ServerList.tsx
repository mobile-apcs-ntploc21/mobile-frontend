import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback
} from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { colors, fonts } from '@/constants/theme';
import MyText from '../MyText';
import SimpleServerList from './SimpleServerList';
import ExtendedServerList from './ExtendedServerList';
import Toggle from '../Toggle';
import useServers from '@/hooks/useServers';
import { getData } from '@/utils/api';

const ServerList = () => {
  const { servers, setServers, selectServer } = useServers();
  const ref = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [90, '95%'], []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitialMount, setIsInitialMount] = useState(true);

  const handleSheetChanges = (index: number) => {
    setCurrentIndex(index);
  };

  const swipeDown = () => {
    ref.current?.snapToIndex(0);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await getData('/api/v1/servers/list'); // return JSON array of servers

        if (!response) {
          setServers([]); // Set empty array if no servers
          return;
        }

        const servers = Object.values(response).map(
          (server: any, index: number) => ({
            id: index.toString(),
            name: server.name
          })
        );

        if (Array.isArray(servers)) {
          setServers(servers);
        } else {
          throw new Error('Failed to fetch servers.');
        }
      } catch (err: any) {
        throw new Error(err.message);
      }

      // setServers(
      //   Array.from({ length: 30 }, (_, index) => ({
      //     id: index.toString(),
      //     name: `Server ${index + 1}`
      //   }))
      // );
    })();
  }, []);

  useEffect(() => {
    if (servers && servers.length > 0 && isInitialMount) {
      selectServer(servers[0].id);
      setIsInitialMount(false);
    }
  }, [servers]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        disappearsOnIndex={0}
        appearsOnIndex={1}
        pressBehavior="collapse"
        {...props}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      index={0}
      handleComponent={() => <View style={styles.handle} />}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.gray03, borderRadius: 30 }}
      enableContentPanningGesture={true}
      enablePanDownToClose={false}
      onChange={handleSheetChanges}
    >
      {currentIndex === 0 ? (
        <SimpleServerList />
      ) : (
        <ExtendedServerList swipeDown={swipeDown} />
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
    marginTop: 13,
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
