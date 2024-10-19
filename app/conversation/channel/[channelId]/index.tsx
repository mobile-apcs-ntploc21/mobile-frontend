import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
import { Channel, Emoji } from '@/types/server';
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
import { deleteData, getData, postData, putData } from '@/utils/api';
import useServers from '@/hooks/useServers';
import debounce from '@/utils/debounce';
import EmojiPicker from '@/components/Chat/EmojiPicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthProvider';

const ChannelConversation = () => {
  const navigation = useNavigation();
  const { currentServerId } = useServers();
  const { categories, roles, members, emojis, permissions } = useServer();
  const { user } = useAuth();
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

  const insets = useSafeAreaInsets();

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

  const handleOpenMessageBottomSheet = useCallback(
    (message: Message) => {
      setModalMessage(message);
      messageBottomSheetRef.current?.present();
      Keyboard.dismiss();
    },
    [messageBottomSheetRef]
  );

  const handleCloseMessageBottomSheet = useCallback(() => {
    messageBottomSheetRef.current?.dismiss();
  }, [messageBottomSheetRef]);

  const reactionBottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenReactionBottomSheet = useCallback(() => {
    reactionBottomSheetRef.current?.present();
  }, [reactionBottomSheetRef]);

  const handleCloseReactionBottomSheet = useCallback(() => {
    reactionBottomSheetRef.current?.dismiss();
  }, [reactionBottomSheetRef]);

  const handleSelectReaction = (emoji: Emoji) => {
    postData(
      `/api/v1/servers/${currentServerId}/channels/${channelId}/messages/${modalMessage?.id}/reactions`,
      {
        emoji_id: emoji.id
      }
    );
    handleCloseReactionBottomSheet();
  };

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
      const emoji = emojis.find((emoji) => emoji.name === emojiName);
      return `:${emoji?.name}:`;
    });

    return content;
  };

  // Some must be sorted by decreasing length to avoid mentioning the wrong user
  const sortedMembers = useMemo(() => {
    return members
      .slice()
      .sort((a, b) => b.username.length - a.username.length);
  }, [members]);
  const sortedRoles = useMemo(() => {
    return roles.slice().sort((a, b) => b.name.length - a.name.length);
  }, [roles]);
  const sortedChannels = useMemo(() => {
    return channels.slice().sort((a, b) => b.name.length - a.name.length);
  }, [channels]);

  const convertInputToContent = (input: string) => {
    sortedMembers.forEach((member) => {
      input = input.replaceAll(`@${member.username}`, `<@${member.user_id}>`);
    });
    sortedRoles.forEach((role) => {
      if (role.default) {
        input = input.replaceAll(`@everyone`, `<@&${role.id}>`);
      }
      input = input.replaceAll(`@${role.name}`, `<@&${role.id}>`);
    });
    sortedChannels.forEach((channel) => {
      input = input.replaceAll(`#${channel.name}`, `<#${channel.id}>`);
    });
    emojis.forEach((emoji) => {
      input = input.replaceAll(
        `:${emoji.name}:`,
        `<:${emoji.name}:${emoji.id}>`
      );
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
  const [actionMessage, setActionMessage] = useState<Message | null>(null);

  const handleCancelMode = () => {
    if (actionMode?.type === 'edit') {
      setChatInput('');
    }
    setActionMode(null);
    setActionMessage(null);
  };

  const handleReact = () => {
    handleCloseMessageBottomSheet();
    handleOpenReactionBottomSheet();
  };

  const handleEdit = () => {
    setChatInput(convertContentToInput(modalMessage?.content || ''));
    setActionMode({ type: 'edit' });
    setActionMessage(modalMessage);
    handleCloseMessageBottomSheet();
  };

  const handleReply = () => {
    setActionMode({
      type: 'reply',
      replyTo: modalMessage?.author.display_name || ''
    });
    setActionMessage(modalMessage);
    handleCloseMessageBottomSheet();
  };

  const handlePin = () => {
    postData(
      `/api/v1/servers/${currentServerId}/channels/${channelId}/messages/${modalMessage?.id}/pin`
    );
    handleCloseMessageBottomSheet();
  };

  const handleUnpin = () => {
    deleteData(
      `/api/v1/servers/${currentServerId}/channels/${channelId}/messages/${modalMessage?.id}/pin`
    );
    handleCloseMessageBottomSheet();
  };

  const handleDelete = () => {
    if (modalMessage!.id === actionMessage?.id) {
      setActionMode(null);
      setActionMessage(null);
    }
    deleteData(
      `/api/v1/servers/${currentServerId}/channels/${channelId}/messages/${modalMessage?.id}`
    );
    handleCloseMessageBottomSheet();
  };

  const handleSend = async () => {
    const content = convertInputToContent(chatInput);
    if (actionMode?.type === 'edit') {
      setChatInput('');
      setActionMode(null);
      const response = await putData(
        `/api/v1/servers/${currentServerId}/channels/${channelId}/messages/${actionMessage?.id}`,
        {
          content
        }
      );
      return;
    }
    setChatInput('');
    setActionMode(null);
    const response = await postData(
      `/api/v1/servers/${currentServerId}/channels/${channelId}/messages`,
      {
        content,
        repliedMessageId:
          actionMode?.type === 'reply' ? actionMessage?.id : undefined
      }
    );
  };

  return (
    <View style={GlobalStyles.screen}>
      <MyBottomSheetModal
        ref={messageBottomSheetRef}
        onClose={handleCloseMessageBottomSheet}
      >
        <ButtonListText
          items={[
            {
              text: 'React',
              onPress: handleReact,
              isHidden: !permissions['ADD_REACTION']
            },
            {
              text: 'Edit',
              onPress: handleEdit,
              isHidden:
                !permissions['MANAGE_MESSAGE'] &&
                modalMessage?.sender_id !== user?.id
            },
            {
              text: 'Reply',
              onPress: handleReply
            },
            {
              text: 'Pin',
              onPress: handlePin,
              isHidden:
                modalMessage?.is_pinned 
            },
            {
              text: 'Unpin',
              onPress: handleUnpin,
              isHidden:
                !modalMessage?.is_pinned
            },
            {
              text: 'Delete',
              onPress: handleDelete,
              style: { color: colors.semantic_red },
              isHidden:
                !permissions['MANAGE_MESSAGE'] &&
                modalMessage?.sender_id !== user?.id
            }
          ]}
        />
      </MyBottomSheetModal>
      <MyBottomSheetModal
        ref={reactionBottomSheetRef}
        backgroundColor={colors.gray04}
        onClose={handleCloseReactionBottomSheet}
      >
        <View style={{ width: '100%' }}>
          <EmojiPicker
            onSelect={handleSelectReaction}
            visible
            handleClose={() => {}}
            height={600}
            emojis={emojis}
          />
        </View>
      </MyBottomSheetModal>
      <FlatList
        keyboardShouldPersistTaps="never"
        data={conversation?.messages || []}
        renderItem={({ item, index }) => (
          <ServerChatItem
            channel_id={channelId!}
            key={item.id}
            message={item}
            onLongPress={() => handleOpenMessageBottomSheet(item)}
            conversation_id={conversation.id}
          />
        )}
        contentContainerStyle={{ gap: 8 }}
        keyExtractor={(item, index) => index.toString()}
        inverted
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
        onEndReached={fetchMessages}
      />
      {permissions['SEND_MESSAGE'] && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={
            Platform.OS === 'ios' ? 96 + insets.bottom : 0
          }
        >
          <ServerChatInput
            value={chatInput}
            onChange={setChatInput}
            mode={actionMode}
            onCancelMode={handleCancelMode}
            onSend={handleSend}
            emojiImports={emojis}
          />
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default ChannelConversation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column-reverse'
  }
});
