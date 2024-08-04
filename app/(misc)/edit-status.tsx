import {
  GestureResponderEvent,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useFormik } from 'formik';
import { router, useNavigation } from 'expo-router';
import CustomTextInput from '@/components/common/CustomTextInput';
import MyHeader from '@/components/MyHeader';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import Toggle from '@/components/Toggle';
import { DefaultCoverImage, DefaultProfileImage } from '@/constants/images';
import GlobalStyles from '@/styles/GlobalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ButtonListRadio from '@/components/ButtonList/ButtonListRadio';
import StatusBubble from '@/components/StatusBubble';
import IconWithSize from '@/components/IconWithSize';
import AddEmojiIcon from '@/assets/icons/AddEmojiIcon';

const ClearAfterArr = [
  { value: '1hour', label: '1 hour' },
  { value: '4hours', label: '4 hours' },
  { value: '1day', label: '1 day' },
  { value: 'never', label: 'Never' }
];

const EditStatus = () => {
  const navigation = useNavigation();
  const formik = useFormik({
    initialValues: {
      emoji: '',
      status: '',
      clearAfter: 'never'
    },
    onSubmit: (values) => {
      console.log(values);
      router.back();
    }
  });

  useLayoutEffect(() => {
    // Fetch user data
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Edit Status"
          headerRight={
            <TouchableOpacity
              onPress={
                formik.handleSubmit as (e?: GestureResponderEvent) => void
              }
            >
              <MyText style={styles.saveButton}>Save</MyText>
            </TouchableOpacity>
          }
        />
      )
    });
  }, []);

  return (
    <View style={GlobalStyles.screen}>
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity style={styles.addEmojiButton}>
            <IconWithSize icon={AddEmojiIcon} size={56} color={colors.white} />
          </TouchableOpacity>
          <StatusBubble
            isEditable
            value={formik.values.status}
            onChangeText={formik.handleChange('status')}
          />
        </View>
        <ButtonListRadio
          heading="Clear status after"
          items={ClearAfterArr.map((item) => ({
            label: item.label,
            value: item.value
          }))}
          value={formik.values.clearAfter}
          onChange={formik.handleChange('clearAfter')}
        />
      </View>
    </View>
  );
};

export default EditStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.gray04,
    gap: 16
  },
  saveButton: {
    ...TextStyles.h3,
    color: colors.primary
  },
  addEmojiButton: {
    backgroundColor: colors.gray03,
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
