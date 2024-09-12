import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import MyHeader from '@/components/MyHeader';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import GlobalStyles from '@/styles/GlobalStyles';
import { TextInput } from 'react-native-gesture-handler';
import BaseChatInput from '@/components/Chat/BaseChatInput';
import useServer from '@/hooks/useServer';
import { Channel } from '@/types/server';
import IconWithSize from '@/components/IconWithSize';
import InfoIcon from '@/assets/icons/InfoIcon';
import { colors } from '@/constants/theme';
import { useConversations } from '@/context/ConversationsProvider';
import { ConversationsTypes, Message } from '@/types/chat';
import ServerChatItem from '@/components/Chat/ServerChatItem';
import MyBottomSheetModal from '@/components/modal/MyBottomSheetModal';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ServerChatInput from '@/components/Chat/ServerChatInput';

const ChannelConversation = () => {
  const navigation = useNavigation();
  const { categories } = useServer();
  const { channelId } = useLocalSearchParams<{
    channelId: string;
  }>();
  const channel: Channel | undefined = useMemo(() => {
    return categories
      .map((category) => category.channels)
      .flat()
      .find((channel) => channel.id === channelId);
  }, [categories, channelId]);
  const { conversations, dispatch: conversationDispatch } = useConversations();
  const conversation = useMemo(() => {
    return conversations.find((conv) => conv.id === channel?.conversation_id);
  }, [conversations, channelId]);

  useLayoutEffect(() => {
    const channelName = channel?.name;
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title={channelName || 'Channel'}
          headerRight={
            <TouchableOpacity onPress={() => router.navigate('./info')}>
              <IconWithSize icon={InfoIcon} size={36} color={colors.primary} />
            </TouchableOpacity>
          }
          // Avoid the glitch where the keyboard is still visible for a short amount of time after go back, making the bottomsheet of the previous screen glitch
          onGoBack={() =>
            new Promise<void>((resolve) => {
              if (!Keyboard.isVisible()) resolve();
              const listener = Keyboard.addListener('keyboardDidHide', () => {
                resolve();
                listener.remove();
              });
              Keyboard.dismiss();
            })
          }
        />
      )
    });
  });

  // Mock get history
  useEffect(() => {
    if (!conversation) return;
    if (conversation.messages.length > 10) return;
    conversationDispatch({
      type: ConversationsTypes.AddConversationMessageHistory,
      payload: {
        conversationId: conversation.id,
        messages: Array.from({ length: 10 }).map((_, i) => {
          return {
            id: (i + 1).toString(),
            content: `Message ${i}`,
            sender_id: '1',
            author: {
              user_id: '1',
              username: 'JohnDoe',
              display_name: 'John Doe',
              avatar_url: 'https://i.pravatar.cc/150?img=1'
            },
            replied_message: null,
            is_modified: true,
            createdAt: new Date().toISOString(),
            reactions: []
          };
        })
      }
    });
  }, []);

  const [chatInput, setChatInput] = useState('');
  const handleSend = () => {
    console.log('Send:', chatInput);
    setChatInput('');
  };

  const messageBottomSheetRef = useRef<BottomSheetModal>(null);
  const [modalMessage, setModalMessage] = useState<Message | null>(null);

  const handleOpenBottomSheet = useCallback(
    (message: Message) => {
      setModalMessage(message);
      messageBottomSheetRef.current?.present();
    },
    [messageBottomSheetRef]
  );

  const handleCloseBottomSheet = useCallback(() => {
    messageBottomSheetRef.current?.dismiss();
  }, [messageBottomSheetRef]);

  return (
    <View style={GlobalStyles.screen}>
      <MyBottomSheetModal
        ref={messageBottomSheetRef}
        onClose={handleCloseBottomSheet}
      >
        <ButtonListText
          items={[
            {
              text: 'React',
              onPress: () => {}
            },
            {
              text: 'Edit',
              onPress: () => {}
            },
            {
              text: 'Reply',
              onPress: () => {}
            },
            {
              text: 'Delete',
              onPress: () => {}
            }
          ]}
        />
      </MyBottomSheetModal>
      <FlatList
        keyboardShouldPersistTaps="always"
        data={conversation?.messages || []}
        renderItem={({ item, index }) => (
          <ServerChatItem
            key={index}
            message={item}
            onLongPress={() => handleOpenBottomSheet(item)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        inverted
      />
      <ServerChatInput
        value={chatInput}
        onChange={setChatInput}
        onSend={handleSend}
      />
    </View>
  );
};

export default ChannelConversation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column-reverse'
  }
});
