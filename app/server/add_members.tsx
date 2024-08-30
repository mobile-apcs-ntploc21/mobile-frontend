import { Alert, StyleSheet, Text, View } from 'react-native';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import useServers from '@/hooks/useServers';
import { Formik, FormikProps } from 'formik';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import MyHeader from '@/components/MyHeader';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import { frequencyMatch } from '@/utils/search';
import Checkbox from '@/components/Checkbox';
import MemberItem from '@/components/userManagment/MemberItem';
import SearchBar from '@/components/SearchBar';

type FormProps = {
  memberIds: string[];
};

/***
 * @description AddMember component is used to select members to perform an action on them
 * Usage:
 * - Use dispatch to set the callback function to be called when the user selects the members
 * - Use router to navigate to the AddMember screen, and pass the `excluded` param to exclude some members from the list
 * Example:
 * ```ts
 * dispatch({
    type: Actions.SET_CALLBACK,
    payload: (memberIds: string[]) => {
      console.log('Adding members:', memberIds);
    }
  });
  router.navigate({
    pathname: '/server/add_members',
    params: {
      excluded: members.map((member) => member.id)
    }
  });
 * ```
 */
const AddMember = () => {
  const { callback, members } = useServers();
  const navigation = useNavigation();
  const formRef = useRef<FormikProps<FormProps>>(null);
  const { excluded } = useLocalSearchParams<{
    excluded?: string;
  }>();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Add Members"
          headerRight={
            <TouchableOpacity
              onPress={async () => {
                if (formRef.current?.isSubmitting) return;
                await formRef.current?.submitForm();
                formRef.current?.setSubmitting(false);
              }}
            >
              <MyText style={styles.headerSave}>Add</MyText>
            </TouchableOpacity>
          }
          onGoBack={() =>
            new Promise((resolve, reject) => {
              if (!formRef.current?.dirty) return resolve();
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
  }, [formRef.current?.dirty]);

  const handleSubmit = (values: FormProps) => {
    try {
      callback(values.memberIds);
      router.back();
    } catch (e) {
      console.error(e);
    }
  };

  const [searchText, setSearchText] = useState('');

  const filteredMemberList = useMemo(() => {
    return members.filter(
      (member) =>
        (frequencyMatch(member.username, searchText) ||
          frequencyMatch(member.display_name, searchText)) &&
        !excluded?.split(',').includes(member.id)
    );
  }, [members, searchText]);

  const handleCheckboxPress = (value: string) => {
    const selected = formRef.current?.values.memberIds || [];
    if (selected.includes(value)) {
      formRef.current?.setFieldValue(
        'memberIds',
        selected.filter((id) => id !== value)
      );
    } else {
      formRef.current?.setFieldValue('memberIds', [...selected, value]);
    }
  };

  return (
    <Formik
      initialValues={{ memberIds: [] }}
      innerRef={formRef}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
    >
      {({ values, setFieldValue }) => (
        <View style={{ flex: 1, backgroundColor: colors.gray04 }}>
          <View style={{ padding: 16 }}>
            <SearchBar value={searchText} onChangeText={setSearchText} />
          </View>
          <ScrollView contentContainerStyle={styles.container}>
            <ButtonListBase
              items={filteredMemberList.map((item, index) => ({
                itemComponent: (
                  <View style={styles.radioContainer} key={index}>
                    <MemberItem member={item} />
                    <Checkbox
                      value={values.memberIds.includes(item.id)}
                      onChange={() => handleCheckboxPress(item.id)}
                    />
                  </View>
                ),
                onPress: () => handleCheckboxPress(item.id)
              }))}
            />
          </ScrollView>
        </View>
      )}
    </Formik>
  );
};

export default AddMember;

const styles = StyleSheet.create({
  headerSave: {
    ...TextStyles.h3,
    color: colors.primary
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000'
  }
});
