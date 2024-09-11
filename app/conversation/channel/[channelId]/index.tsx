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
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import MyHeader from '@/components/MyHeader';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import GlobalStyles from '@/styles/GlobalStyles';
import { TextInput } from 'react-native-gesture-handler';
import ChatInput from '@/components/Chat/ChatInput';
import useServer from '@/hooks/useServer';
import { Channel } from '@/types/server';
import IconWithSize from '@/components/IconWithSize';
import InfoIcon from '@/assets/icons/InfoIcon';
import { colors } from '@/constants/theme';
import { useConversations } from '@/context/ConversationsProvider';
import { ConversationsTypes } from '@/types/chat';
import ServerChatItem from '@/components/Chat/ServerChatItem';

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
            replied_message: null,
            is_modified: false,
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

  return (
    <KeyboardAvoidingView style={GlobalStyles.screen}>
      <FlatList
        keyboardShouldPersistTaps="always"
        data={conversation?.messages || []}
        renderItem={({ item, index }) => (
          <ServerChatItem key={index} message={item} />
        )}
        keyExtractor={(item, index) => index.toString()}
        inverted
      />
      <ChatInput
        value={chatInput}
        onChange={setChatInput}
        onSend={handleSend}
      />
    </KeyboardAvoidingView>
  );
};

export default ChannelConversation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column-reverse'
  }
});
