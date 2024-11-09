import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Formik, FormikProps } from 'formik';

import MyHeader from '@/components/MyHeader';
import { colors, fonts } from '@/constants/theme';
import MyText from '@/components/MyText';
import GlobalStyles from '@/styles/GlobalStyles';
import Avatar from '@/components/Avatar';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import ButtonListCheckbox from '@/components/ButtonList/ButtonListCheckbox';
import MyList from '@/components/MyList';
import ToggleItem3, { STATE } from '@/components/Toggles/ToggleItem3';
import SearchBar from '@/components/SearchBar';
import useServer from '@/hooks/useServer';
import { getData, patchData } from '@/utils/api';
import { useAuth } from '@/context/AuthProvider';
import { frequencyMatch } from '@/utils/search';

const EditPermissions = () => {
  const navigation = useNavigation();
  const { server_id } = useServer();
  const { user } = useAuth();
  const {
    user_role_type,
    user_role_id,
    category_channel_type,
    category_channel_id
  } = useLocalSearchParams<{
    user_role_type?: string;
    user_role_id?: string;
    category_channel_type?: string;
    category_channel_id?: string;
  }>();
  const [loading, setLoading] = useState(true);

  const [permissions, setPermissions] = useState<{
    [key: string]: 'ALLOWED' | 'DENIED' | 'DEFAULT';
  }>({});
  useEffect(() => {
    (async () => {
      try {
        const response = await getData(
          `/api/v1/servers/${server_id}/${category_channel_type}s/${category_channel_id}/${user_role_type}s/${user_role_id}/permissions`
        );
        setLoading(false);
        setPermissions(response);
      } catch (e: any) {
        console.error(e.message);
      }
    })();
  }, []);

  const permissionsList = useMemo(() => {
    const permissionItem = (value: string, label: string) => {
      let state;
      if (permissions[value] === 'ALLOWED') {
        state = STATE.YES;
      } else if (permissions[value] === 'DENIED') {
        state = STATE.NO;
      } else {
        state = STATE.NULL;
      }
      return {
        value,
        label,
        state
      };
    };

    return [
      {
        title: 'General Permissions',
        permissions: [
          permissionItem('VIEW_CHANNEL', 'View Channels'),
          permissionItem('MANAGE_CHANNEL', 'Manage Channels')
        ]
      },
      {
        title: 'Text Chat Permissions',
        permissions: [
          permissionItem('SEND_MESSAGE', 'Send Messages'),
          permissionItem('ATTACH_FILE', 'Attach Files'),
          permissionItem('ADD_REACTION', 'Add Reactions'),
          permissionItem('USE_EXTERNAL_EMOJI', 'Use External Emoji'),
          permissionItem('MENTION_ALL', 'Mention @everyone and Roles'),
          permissionItem('MANAGE_MESSAGE', 'Manage Messages')
        ]
      },
      {
        title: 'Voice Channel Permissions',
        permissions: [
          permissionItem('VOICE_CONNECT', 'Connect'),
          permissionItem('VOICE_SPEAK', 'Speak'),
          permissionItem('VOICE_VIDEO', 'Video'),
          permissionItem('VOICE_MUTE_MEMBER', 'Mute Members'),
          permissionItem('VOICE_DEAFEN_MEMBER', 'Deafen Members')
        ]
      }
    ];
  }, [permissions]);

  const [searchText, setSearchText] = useState('');
  const filteredPermissionsList = useMemo(() => {
    if (!searchText) return permissionsList;
    const result = permissionsList.map((group) => ({
      ...group,
      permissions: group.permissions.filter((permission) =>
        frequencyMatch(permission.label, searchText)
      )
    }));
    return result.filter((group) => group.permissions.length > 0);
  }, [permissionsList, searchText]);

  const handleSave = async () => {
    const tmp = JSON.stringify(permissions);
    const response = await patchData(
      `/api/v1/servers/${server_id}/${category_channel_type}s/${category_channel_id}/${user_role_type}s/${user_role_id}/permissions`,
      permissions
    );
    router.back();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Edit Permissions"
          headerRight={
            <TouchableOpacity onPress={handleSave}>
              <MyText style={styles.save}>Save</MyText>
            </TouchableOpacity>
          }
          onGoBack={() =>
            new Promise((resolve, reject) => {
              Alert.alert(
                'Discard changes',
                'Are you sure you want to discard changes?',
                [
                  {
                    text: 'No',
                    style: 'cancel',
                    onPress: () => reject()
                  },
                  {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: () => resolve()
                  }
                ]
              );
            })
          }
        />
      )
    });
  }, [handleSave]);

  if (loading)
    return (
      <View style={GlobalStyles.screenGray}>
        <ActivityIndicator />
      </View>
    );

  return (
    <View style={GlobalStyles.screenGray}>
      <View style={styles.searchContainer}>
        <View style={{ flex: 1 }}>
          <SearchBar value={searchText} onChangeText={setSearchText} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {filteredPermissionsList.map((permissionGroup) => (
          <MyList
            key={permissionGroup.title}
            heading={permissionGroup.title}
            items={permissionGroup.permissions.map((permission) => (
              <ToggleItem3
                text={permission.label}
                value={permission.state}
                onChange={(value) => {
                  setPermissions((prev) => ({
                    ...prev,
                    [permission.value]:
                      value === STATE.YES
                        ? 'ALLOWED'
                        : value === STATE.NO
                        ? 'DENIED'
                        : 'DEFAULT'
                  }));
                }}
              />
            ))}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default EditPermissions;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16
  },
  save: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fonts.medium
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    margin: 16
  }
});
