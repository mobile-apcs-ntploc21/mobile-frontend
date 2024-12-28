import useFetch from '@/hooks/useFetch';
import { DMChannel } from '@/types/DM';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useConversations } from './ConversationsProvider';
import { ConversationsTypes } from '@/types/chat';
import { useSubscription } from '@apollo/client';
import { DIRECT_MESSAGE_SUBSCRIPTION } from '@/services/graphql/subscriptions';
import { ServerEvents } from '@/types';
import { useAuth } from './AuthProvider';

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
  const { user } = useAuth();
  const {
    data: directMessagesFetched,
    loading,
    error
  } = useFetch<any[]>('/api/v1/direct-messages/me', user, {
    method: 'GET'
  });
  const [directMessages, setDirectMessages] = useState<DMChannel[]>([]);
  const {
    dispatch: conversationDispatch,
    conversations,
    focusId
  } = useConversations();

  useEffect(() => {
    if (directMessagesFetched instanceof Array) {
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

  useEffect(() => {
    if (error) {
      throw new Error(error);
    }
  }, [error]);

  const handleSubscriptionData = (
    conversationId: string,
    subscriptionData: any
  ) => {
    console.log('subscriptionData', subscriptionData);
    if (!subscriptionData) return;
    const conversation = conversations.find(
      (conversation) => conversation.id === conversationId
    );
    if (!conversation) return;

    const { directMessageUpdated: dmData } = subscriptionData;
    const { conversation_id: subConversationId, type, data } = dmData;

    if (conversationId !== subConversationId) {
      console.log('conversationId !== subConversationId');
      return;
    }

    switch (type) {
      case ServerEvents.messageAdded:
        conversationDispatch({
          type: ConversationsTypes.AddConversationMessage,
          payload: {
            conversationId: data.conversation_id,
            message: data.message
          }
        });
        if (data.conversation_id !== focusId) {
          // Mark the conversation as having a new message
          conversationDispatch({
            type: ConversationsTypes.PatchConversation,
            payload: {
              conversationId: data.conversation_id,
              patch: {
                has_new_message: true
              }
            }
          });
          // Increment the number of unread mentions
          conversationDispatch({
            type: ConversationsTypes.IncrementUnreadMentions,
            payload: {
              conversationId: data.conversation_id,
              number: 1
            }
          });
        }
        break;
      case ServerEvents.messageEdited:
        conversationDispatch({
          type: ConversationsTypes.SetConversationMessage,
          payload: {
            conversationId: data.conversation_id,
            message: data.message
          }
        });
        break;
      case ServerEvents.messageDeleted:
        conversationDispatch({
          type: ConversationsTypes.DeleteConversationMessage,
          payload: {
            conversationId: data.conversation_id,
            messageId: data.message_id
          }
        });
        break;
      case ServerEvents.messagePinAdded:
        conversationDispatch({
          type: ConversationsTypes.SetMessagePin,
          payload: {
            conversationId: data.conversation_id,
            messageId: data.message._id,
            is_pinned: true
          }
        });
        break;
      case ServerEvents.messagePinRemoved:
        conversationDispatch({
          type: ConversationsTypes.SetMessagePin,
          payload: {
            conversationId: data.conversation_id,
            messageId: data.message_id,
            is_pinned: false
          }
        });
        break;
      case ServerEvents.messageMentionedUser:
        // if (data.conversation_id !== focusId) {
        //   // Increment the number of unread mentions
        //   conversationDispatch({
        //     type: ConversationsTypes.IncrementUnreadMentions,
        //     payload: {
        //       conversationId: data.conversation_id,
        //       number: 1
        //     }
        //   });
        // }
        break;
      case ServerEvents.messageMentionedRole:
        if (data.conversation_id !== focusId) {
          // Increment the number of unread mentions
          conversationDispatch({
            type: ConversationsTypes.IncrementUnreadMentions,
            payload: {
              conversationId: data.conversation_id,
              number: 1
            }
          });
        }
        break;
      case ServerEvents.messageReactionAdded:
        conversationDispatch({
          type: ConversationsTypes.SetMessageReaction,
          payload: {
            conversationId: data.conversation_id,
            messageId: data.message_id,
            reactions: data.reactions
          }
        });
        break;
      case ServerEvents.messageReactionRemoved:
        conversationDispatch({
          type: ConversationsTypes.SetMessageReaction,
          payload: {
            conversationId: data.conversation_id,
            messageId: data.message_id,
            reactions: data.reactions
          }
        });
        break;
      default:
        console.log('Unknown event type:', type);
        console.log(type, data);
    }
  };

  return (
    <DMContext.Provider
      value={{
        data: directMessages,
        loading,
        error
      }}
    >
      {directMessages.map((dm) => (
        <SubcriptionComponent
          key={dm.conversation_id}
          conversationId={dm.conversation_id}
          onUpdate={handleSubscriptionData}
        />
      ))}
      {children}
    </DMContext.Provider>
  );
}

const SubcriptionComponent = (props: {
  conversationId: string;
  onUpdate: (conversationId: string, data: any) => void;
}) => {
  const { data, error } = useSubscription(DIRECT_MESSAGE_SUBSCRIPTION, {
    variables: {
      conversation_id: props.conversationId
    }
  });

  useEffect(() => {
    if (error) {
      throw new Error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      props.onUpdate(props.conversationId, data);
    }
  }, [data]);

  return null;
};
