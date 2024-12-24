import useFetch from '@/hooks/useFetch';
import { DMChannel } from '@/types/DM';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useConversations } from './ConversationsProvider';
import { ConversationsTypes } from '@/types/chat';

interface DMContextValue {
  data: DMChannel[];
  loading: boolean;
  error: string | null;
}

const DMContext = createContext<DMContextValue | undefined>(undefined);

export const useDMContext = () => {
  const context = useContext(DMContext);
  if (context === undefined) {
    throw new Error('useDMContext must be used within a DMProvider');
  }
  return context;
};

interface DMProviderProps {
  children: React.ReactNode;
}

export default function DMProvider({ children }: DMProviderProps) {
  const {
    data: directMessagesFetched,
    loading,
    error
  } = useFetch<any[]>('/api/v1/direct-messages/me', {
    method: 'GET'
  });
  const [directMessages, setDirectMessages] = useState<DMChannel[]>([]);
  const { dispatch: conversationDispatch, conversations } = useConversations();

  useEffect(() => {
    if (directMessagesFetched) {
      setDirectMessages(
        directMessagesFetched.map((dm) => {
          return {
            user_id: dm.other_user.user_id,
            name: dm.other_user.display_name,
            avatar_url: dm.other_user.avatar_url,
            conversation_id: dm.direct_message.conversation_id
          };
        })
      );
      directMessagesFetched.forEach((channel: any) => {
        conversationDispatch({
          type: ConversationsTypes.AddConversation,
          payload: {
            conversation: {
              id: channel.direct_message.conversation_id,
              type: 'direct',
              number_of_unread_mentions:
                channel.direct_message.number_of_unread_mentions,
              has_new_message: channel.direct_message.has_new_message,
              messages: [],
              pinned_messages: []
            },
            focus: false
          }
        });
        conversationDispatch({
          type: ConversationsTypes.AddConversationMessage,
          payload: {
            conversationId: channel.direct_message.conversation_id,
            message: channel.direct_message.latest_message
          }
        });
      });
    }
  }, [directMessagesFetched]);

  // useEffect(() => {
  //   console.log('conversations', conversations);
  // }, [conversations]);

  useEffect(() => {
    if (error) {
      throw new Error(error);
    }
  }, [error]);

  // useEffect(() => {
  //   console.log('directMessages', directMessages);
  // }, [directMessages]);

  return (
    <DMContext.Provider
      value={{
        data: directMessages,
        loading,
        error
      }}
    >
      {children}
    </DMContext.Provider>
  );
}
