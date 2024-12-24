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
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import GlobalStyles from '@/styles/GlobalStyles';
import { Emoji } from '@/types/server';
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
import DMChatItem from '@/components/Chat/DMChatItem';
import { useUserContext } from '@/context/UserProvider';
import { useUserById } from '@/hooks/useUserById';
import { useDMContext } from '@/context/DMProvider';

const ChannelConversation = () => {
  const navigation = useNavigation();
  const { emojiCategories } = useServers();
  const emojis = useMemo(
    () => emojiCategories.flatMap((category) => category.emojis),
    [emojiCategories]
  );

  const { user } = useAuth();
  const { userId } = useLocalSearchParams<{
    userId: string;
  }>();
  const { conversations, dispatch: conversationDispatch } = useConversations();
  const { data: dmChannels } = useDMContext();
  const channel = useMemo(
    () => dmChannels.find((channel) => channel.user_id === userId),
    [dmChannels, userId]
  );
  const conversation = useMemo(() => {
    return conversations.find((conv) => conv.id === channel?.conversation_id);
  }, [conversations, userId])!;

  const { data: userProfile } = useUserContext();
  const { data: otherUserProfile } = useUserById(userId);

  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    const channelName = otherUserProfile.display_name;
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
  const [messageEndReached, setMessageEndReached] = useState(false);

  const fetchMessages = async () => {
    if (!conversation) return;
    if (conversation.messages.length === 0) return;
    if (messageEndReached) return;
    if (loading) return;
    setLoading(true);
    const response = await getData(
      `/api/v1/direct-messages/${userId}`,
      {},
      {
        before: conversation.messages.at(-1)?.id,
        limit: 10
      }
    );
    if (response.messages.length === 0) {
      setMessageEndReached(true);
    }
    conversationDispatch({
      type: ConversationsTypes.AddConversationMessageHistory,
      payload: {
        conversationId: conversation.id,
        messages: response.messages
      }
    });
    setLoading(false);
  };

  const fetchPinned = async () => {
    if (!userId || !conversation) return;

    const response = await getData(`/api/v1/direct-messages/${userId}/pins`);

    conversationDispatch({
      type: ConversationsTypes.AddPinnedMessages,
      payload: {
        conversationId: conversation.id,
        messages: response.messages
      }
    });
  };

  useEffect(() => {
    conversationDispatch({
      type: ConversationsTypes.SetFocus,
      payload: {
        conversationId: conversation.id
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
    fetchPinned();
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
      postData(`/api/v1/direct-messages/${userId}/read`);
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

  const handleSelectReaction = useCallback(
    (emoji: Emoji) => {
      postData(
        `/api/v1/direct-messages/${userId}/${modalMessage?.id}/reactions`,
        {
          emoji_id: emoji.id
        }
      );
      handleCloseReactionBottomSheet();
    },
    [modalMessage]
  );

  const convertContentToInput = (content: string) => {
    // const userPattern = /<@!?([a-f0-9]{24})>/g;
    const emojiPattern = /<:(.*?):(?:[a-f0-9]{24})>/g;

    // content = content.replace(userPattern, (match, userId) => {
    //   const member = members.find((member) => member.user_id === userId);
    //   return `@${member?.username}`;
    // });

    content = content.replace(emojiPattern, (match, emojiName) => {
      const emoji = emojiCategories
        .find((category) =>
          category.emojis.find((emoji) => emoji.name === emojiName)
        )
        ?.emojis.find((emoji) => emoji.name === emojiName);
      return `:${emoji?.name}:`;
    });

    return content;
  };

  const convertInputToContent = (input: string) => {
    // get unique emoji names from emojis
    const emojiNames = emojis.map((emoji) => emoji.name);
    const emojiNameSet = new Set(emojiNames);

    // for each emoji name, replace all instances of the emoji name with the emoji id
    emojiNameSet.forEach((emojiName) => {
      const emoji = emojis.find((emoji) => emoji.name === emojiName);
      input = input.replaceAll(
        `:${emojiName}:`,
        `<:${emojiName}:${emoji?.id}>`
      );
    });

    // emojis.forEach((emoji) => {
    //   input = input.replaceAll(
    //     `:${emoji.name}:`,
    //     `<:${emoji.name}:${emoji.id}>`
    //   );
    // });

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
    postData(`/api/v1/direct-messages/${userId}/${modalMessage?.id}/pin`);
    handleCloseMessageBottomSheet();
  };

  const handleUnpin = () => {
    deleteData(`/api/v1/direct-messages/${userId}/${modalMessage?.id}/pin`);
    handleCloseMessageBottomSheet();
  };

  const handleDelete = () => {
    if (modalMessage!.id === actionMessage?.id) {
      setActionMode(null);
      setActionMessage(null);
    }
    deleteData(`/api/v1/direct-messages/${modalMessage?.id}`);
    handleCloseMessageBottomSheet();
  };

  const handleSend = async () => {
    const content = convertInputToContent(chatInput);
    if (actionMode?.type === 'edit') {
      setChatInput('');
      setActionMode(null);
      const response = await putData(
        `/api/v1/direct-messages/${actionMessage?.id}`,
        {
          content
        }
      );
      return;
    }
    setChatInput('');
    setActionMode(null);
    const response = await postData(`/api/v1/direct-messages/${userId}`, {
      content,
      repliedMessageId:
        actionMode?.type === 'reply' ? actionMessage?.id : undefined
    });
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
              onPress: handleReact
            },
            {
              text: 'Edit',
              onPress: handleEdit,
              isHidden: modalMessage?.sender_id !== user?.id
            },
            {
              text: 'Reply',
              onPress: handleReply
            },
            {
              text: 'Pin',
              onPress: handlePin,
              isHidden: modalMessage?.is_pinned
            },
            {
              text: 'Unpin',
              onPress: handleUnpin,
              isHidden: !modalMessage?.is_pinned
            },
            {
              text: 'Delete',
              onPress: handleDelete,
              style: { color: colors.semantic_red },
              isHidden: modalMessage?.sender_id !== user?.id
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
            handleClose={useCallback(() => {}, [])}
            height={600}
            importedEmojiCategories={emojiCategories}
          />
        </View>
      </MyBottomSheetModal>
      <FlatList
        keyboardShouldPersistTaps="never"
        data={conversation?.messages || []}
        renderItem={({ item, index }) => (
          <DMChatItem
            key={item.id}
            message={item}
            onLongPress={() => handleOpenMessageBottomSheet(item)}
            conversation_id={conversation.id}
            users={[userProfile, otherUserProfile]}
            onReact={(emojiId) => {
              postData(
                `/api/v1/direct-messages/${userId}/${item.id}/reactions`,
                {
                  emoji_id: emojiId
                }
              );
            }}
            onUnreact={(emojiId) => {
              deleteData(
                `/api/v1/direct-messages/${userId}/${item.id}/reactions`,
                {
                  emoji_id: emojiId
                }
              );
            }}
          />
        )}
        contentContainerStyle={{ gap: 8 }}
        keyExtractor={(item, index) => index.toString()}
        inverted
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
        onEndReached={fetchMessages}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 96 + insets.bottom : 0}
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
    </View>
  );
};

export default ChannelConversation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column-reverse'
  }
});
