import {
  ActivityIndicator,
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
import { getData, postData } from '@/utils/api';
import useServers from '@/hooks/useServers';
import debounce from '@/utils/debounce';

const ChannelConversation = () => {
  const navigation = useNavigation();
  const { currentServerId } = useServers();
  const { categories, roles, members } = useServer();
  const channels = useMemo(() => {
    return categories.map((category) => category.channels).flat();
  }, [categories]);
  const { channelId } = useLocalSearchParams<{
    channelId: string;
  }>();
  const channel: Channel | undefined = useMemo(() => {
    return channels.find((channel) => channel.id === channelId);
  }, [channels, channelId]);
  const { conversations, dispatch: conversationDispatch } = useConversations();
  const conversation = useMemo(() => {
    return conversations.find((conv) => conv.id === channel?.conversation_id);
  }, [conversations, channelId])!;

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

  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    if (!conversation) return;
    if (conversation.messages.length === 0) return;
    setLoading(true);
    const response = await getData(
      `/api/v1/servers/${currentServerId}/channels/${channelId}/messages`,
      {},
      {
        before: conversation.messages.at(-1)?.id,
        limit: 10
      }
    );
    conversationDispatch({
      type: ConversationsTypes.AddConversationMessageHistory,
      payload: {
        conversationId: conversation.id,
        messages: response.messages
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    conversationDispatch({
      type: ConversationsTypes.SetFocus,
      payload: {
        conversationId: channel?.conversation_id || ''
      }
    });
    conversationDispatch({
      type: ConversationsTypes.PatchConversation,
      payload: {
        conversationId: conversation.id,
        patch: {
          has_new_message: false,
          number_of_unread_mentions: 0
        }
      }
    });
    if (conversation && conversation.messages.length < 10) fetchMessages();
    return () => {
      conversationDispatch({
        type: ConversationsTypes.SetFocus,
        payload: {
          conversationId: ''
        }
      });
    };
  }, []);

  const debouncedMarkAsRead = useMemo(() => {
    return debounce(() => {
      if (!conversation) return;
      if (conversation.messages.length === 0) return;
      postData(
        `/api/v1/servers/${currentServerId}/channels/${channelId}/messages/read`
      );
    }, 1000);
  }, []);

  useEffect(() => {
    if (!conversation) return;
    debouncedMarkAsRead();
  }, [conversation?.messages[0]]);

  const [chatInput, setChatInput] = useState('');

  const messageBottomSheetRef = useRef<BottomSheetModal>(null);
  const [modalMessage, setModalMessage] = useState<Message | null>(null);

  const handleOpenBottomSheet = useCallback(
    (message: Message) => {
      setModalMessage(message);
      messageBottomSheetRef.current?.present();
      Keyboard.dismiss();
    },
    [messageBottomSheetRef]
  );

  const handleCloseBottomSheet = useCallback(() => {
    messageBottomSheetRef.current?.dismiss();
  }, [messageBottomSheetRef]);

  const convertContentToInput = (content: string) => {
    const userPattern = /<@!?([a-f0-9]{24})>/g;
    const rolePattern = /<@&([a-f0-9]{24})>/g;
    const channelPattern = /<#([a-f0-9]{24})>/g;
    const emojiPattern = /<:(.*?):(?:[a-f0-9]{24})>/g;

    content = content.replace(userPattern, (match, userId) => {
      const member = members.find((member) => member.user_id === userId);
      return `@${member?.username}`;
    });

    content = content.replace(rolePattern, (match, roleId) => {
      const role = roles.find((role) => role.id === roleId);
      return `@${role?.name}`;
    });

    content = content.replace(channelPattern, (match, channelId) => {
      const channel = channels.find((channel) => channel.id === channelId);
      return `#${channel?.name}`;
    });

    content = content.replace(emojiPattern, (match, emojiName) => {
      return `:${emojiName}:`;
    });

    return content;
  };

  const convertInputToContent = (input: string) => {
    members.forEach((member) => {
      input = input.replace(`@${member.username}`, `<@${member.user_id}>`);
    });
    roles.forEach((role) => {
      input = input.replace(`@${role.name}`, `<@&${role.id}>`);
    });
    channels.forEach((channel) => {
      input = input.replace(`#${channel.name}`, `<#${channel.id}>`);
    });
    return input;
  };

  const [actionMode, setActionMode] = useState<
    | {
        type: 'edit';
      }
    | {
        type: 'reply';
        replyTo: string;
      }
    | null
  >(null);

  const handleCancelMode = () => {
    if (actionMode?.type === 'edit') {
      setChatInput('');
    }
    setActionMode(null);
  };

  const handleEdit = () => {
    setChatInput(convertContentToInput(modalMessage?.content || ''));
    setActionMode({ type: 'edit' });
    handleCloseBottomSheet();
  };

  const handleReply = () => {
    setActionMode({
      type: 'reply',
      replyTo: modalMessage?.author.display_name || ''
    });
    handleCloseBottomSheet();
  };

  const handleSend = async () => {
    const content = convertInputToContent(chatInput);
    if (actionMode?.type === 'edit') {
      setChatInput('');
      setActionMode(null);
      console.log('Edit', content);
      return;
    }
    setChatInput('');
    setActionMode(null);
    const response = await postData(
      `/api/v1/servers/${currentServerId}/channels/${channelId}/messages`,
      {
        content,
        repliedMessageId:
          actionMode?.type === 'reply' ? modalMessage?.id : undefined
      }
    );
  };

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
              onPress: handleEdit
            },
            {
              text: 'Reply',
              onPress: handleReply
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
        contentContainerStyle={{ gap: 8 }}
        keyExtractor={(item, index) => index.toString()}
        inverted
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
        onEndReached={fetchMessages}
      />
      <ServerChatInput
        value={chatInput}
        onChange={setChatInput}
        mode={actionMode}
        onCancelMode={handleCancelMode}
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
