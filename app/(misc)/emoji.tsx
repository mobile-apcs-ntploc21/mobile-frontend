import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyHeader from '@/components/MyHeader';
import GlobalStyles from '@/styles/GlobalStyles';
import { colors } from '@/constants/theme';
import IconWithSize from '@/components/IconWithSize';
import AddEmojiIcon from '@/assets/icons/AddEmojiIcon';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import { ScrollView } from 'react-native-gesture-handler';
import TrashIcon from '@/assets/icons/TrashIcon';
import BasicModal from '@/components/modal/BasicModal';
import CustomTextInput from '@/components/common/CustomTextInput';
import * as ImagePicker from 'expo-image-picker';

const placeholderEmojiList = Array.from({ length: 10 }, (_, i) => ({
  id: `e${i + 1}`,
  name: `emoji-${i + 1}`,
  image_url: `https://via.placeholder.com/150x150.png?text=Emoji+${i + 1}`,
  uploader_id: `user-${i + 1}`
}));

const Emoji = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Emoji" />
      )
    });
  }, []);

  const [emojiList, setEmojiList] = useState<
    {
      id: string;
      name: string;
      image_url: string;
      uploader_id: string;
    }[]
  >(placeholderEmojiList);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [modalEmojiId, setModalEmojiId] = useState('');
  const [modalEmojiName, setModalEmojiName] = useState('');

  const handleAddEmoji = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1]
    });

    if (!result.canceled) {
      // postData();
      setEmojiList((prev) => [
        {
          id: `e${prev.length + 1}`,
          name: `emoji-${prev.length + 1}`,
          image_url: result.assets[0].uri,
          uploader_id: 'user-1'
        },
        ...prev
      ]);
    } else {
      // alert('You did not select any image.');
    }
  };

  const handleDeleteEmoji = (id: string) => {
    setModalEmojiId(id);
    setModalEmojiName(emojiList.find((emoji) => emoji.id === id)?.name || '');
    setDeleteModalVisible(true);
  };

  const handleUpdateEmoji = (id: string) => {
    setModalEmojiId(id);
    setModalEmojiName(emojiList.find((emoji) => emoji.id === id)?.name || '');
    setEditModalVisible(true);
  };

  return (
    <View style={[GlobalStyles.screen, { backgroundColor: colors.gray04 }]}>
      <BasicModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="Delete Emoji"
        onConfirm={() => {
          // deleteData();
          setEmojiList((prev) =>
            prev.filter((emoji) => emoji.id !== modalEmojiId)
          );
        }}
      >
        <MyText>{`Are you sure you want to delete :${modalEmojiName}:?`}</MyText>
      </BasicModal>

      <BasicModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        title="Edit Emoji"
        confirmText="Save"
        onConfirm={() => {
          // updateData();
          setEmojiList((prev) =>
            prev.map((emoji) =>
              emoji.id === modalEmojiId
                ? { ...emoji, name: modalEmojiName }
                : emoji
            )
          );
        }}
      >
        <View style={styles.editModalContainer}>
          <Image
            style={styles.emojiImageEdit}
            source={{
              uri: emojiList.find((emoji) => emoji.id === modalEmojiId)
                ?.image_url
            }}
          />
          <View style={{ flex: 1 }}>
            <CustomTextInput
              value={modalEmojiName}
              onChangeText={setModalEmojiName}
            />
          </View>
        </View>
      </BasicModal>

      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.addEmojiContainer}
            onPress={handleAddEmoji}
          >
            <View style={styles.addEmojiButton}>
              <IconWithSize
                icon={AddEmojiIcon}
                size={56}
                color={colors.white}
              />
            </View>
            <MyText style={styles.addEmojiText}>Add Emoji</MyText>
          </TouchableOpacity>
          <ButtonListBase
            heading={`All Emoji (${emojiList.length}/20)`}
            items={emojiList.map((item) => ({
              itemComponent: (
                <View style={styles.emojiItemContainer}>
                  <View style={styles.emojiInfoContainer}>
                    <Image
                      style={styles.emojiImage}
                      source={{ uri: item.image_url }}
                    />
                    <MyText
                      style={styles.emojiNameText}
                    >{`:${item.name}:`}</MyText>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteEmoji(item.id)}>
                    <IconWithSize
                      icon={TrashIcon}
                      size={24}
                      color={colors.semantic_red}
                    />
                  </TouchableOpacity>
                </View>
              ),
              onPress: () => handleUpdateEmoji(item.id)
            }))}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Emoji;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 32,
    alignItems: 'center'
  },
  emojiImageEdit: {
    width: 40,
    height: 40
  },
  editModalContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16
  },
  addEmojiContainer: {
    gap: 4,
    alignItems: 'center'
  },
  addEmojiButton: {
    backgroundColor: colors.gray03,
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addEmojiText: {
    ...TextStyles.h5,
    color: colors.gray02
  },
  emojiItemContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  emojiInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  emojiImage: {
    width: 24,
    height: 24
  },
  emojiNameText: {
    ...TextStyles.h5,
    fontSize: 14
  }
});