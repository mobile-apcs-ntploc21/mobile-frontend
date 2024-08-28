import { useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
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

const EditPermissions = () => {
  const navigation = useNavigation();
  const [groupPermissions, setGroupPermissions] = useState<any[]>([]);

  const handleSave = () => {
    console.log(JSON.stringify(groupPermissions));
  };

  useEffect(() => {
    setGroupPermissions(
      Array.from({ length: 5 }, (_, index) => ({
        id: index.toString(),
        name: `Group ${index}`,
        permissions: Array.from({ length: 5 }, (_, index) => ({
          id: index.toString(),
          name: `Permission ${index}`,
          state: STATE.NULL
        }))
      }))
    );
  }, []);

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
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {groupPermissions.map((group) => (
        <MyList
          heading={group.name}
          // @ts-ignore
          items={group.permissions.map((permission) => (
            <ToggleItem3 text={permission.name} />
          ))}
        />
      ))}
    </ScrollView>
  );
};

export default EditPermissions;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16
  },
  save: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fonts.medium
  }
});
