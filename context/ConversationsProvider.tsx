import { Conversation, ConversationsTypes, Reaction } from '@/types/chat';
import { ConversationsAction } from '@/types/chat';
import { createContext, Dispatch, useContext, useReducer } from 'react';

export type ConversationsState = {
  conversations: Conversation[];
  focusId: string | null;
};

const initialState: ConversationsState = {
  conversations: [],
  focusId: null
};

const reducer = (
  state: ConversationsState,
  { type, payload }: ConversationsAction
): ConversationsState => {
  switch (type) {
    case ConversationsTypes.SetFocus:
      return {
        ...state,
        focusId: payload.conversationId
      };
    case ConversationsTypes.AddConversation:
      return {
        ...state,
        conversations: [...state.conversations, payload.conversation],
        focusId: payload.focus ? payload.conversation.id : state.focusId
      };
    case ConversationsTypes.SetConversation:
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === payload.conversation.id
            ? payload.conversation
            : conversation
        )
      };
    case ConversationsTypes.PatchConversation:
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === payload.conversationId
            ? {
                ...conversation,
                ...payload.patch
              }
            : conversation
        )
      };
    case ConversationsTypes.IncrementUnreadMentions:
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === payload.conversationId
            ? {
                ...conversation,
                number_of_unread_mentions:
                  conversation.number_of_unread_mentions + payload.number
              }
            : conversation
        )
      };
    case ConversationsTypes.AddConversations:
      return {
        ...state,
        conversations: [...state.conversations, ...payload.conversations]
      };
    case ConversationsTypes.RemoveConversation:
      return {
        ...state,
        conversations: state.conversations.filter(
          (conversation) => conversation.id !== payload.conversationId
        ),
        focusId: state.focusId === payload.conversationId ? null : state.focusId
      };
    case ConversationsTypes.AddConversationMessage:
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === payload.conversationId
            ? {
                ...conversation,
                messages: [payload.message, ...conversation.messages]
              }
            : conversation
        )
      };
    case ConversationsTypes.AddConversationMessageHistory:
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === payload.conversationId
            ? {
                ...conversation,
                messages: [...conversation.messages, ...payload.messages]
              }
            : conversation
        )
      };
    case ConversationsTypes.SetConversationMessage:
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === payload.conversationId
            ? {
                ...conversation,
                messages: conversation.messages.map((message) =>
                  message.id === payload.message.id ? payload.message : message
                )
              }
            : conversation
        )
      };
    case ConversationsTypes.SetConversationMessages:
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === payload.conversationId
            ? {
                ...conversation,
                messages: payload.messages
              }
            : conversation
        )
      };
    case ConversationsTypes.DeleteConversationMessage:
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === payload.conversationId
            ? {
                ...conversation,
                messages: conversation.messages.filter(
                  (message) => message.id !== payload.messageId
                )
              }
            : conversation
        )
      };
    case ConversationsTypes.SetMessageReaction:
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === payload.conversationId
            ? {
                ...conversation,
                messages: conversation.messages.map((message) =>
                  message.id === payload.messageId
                    ? {
                        ...message,
                        reactions: payload.reactions.reduce((acc, reaction) => {
                          const found = acc.find(
                            (r) => r.emoji_id === reaction.emoji_id
                          );
                          if (found) {
                            found.count++;
                            found.reactors = [
                              ...found.reactors,
                              // @ts-ignore
                              reaction.sender_id
                            ];
                            return acc;
                          }
                          return [
                            ...acc,
                            {
                              ...reaction,
                              count: 1,
                              // @ts-ignore
                              reactors: [reaction.sender_id]
                            }
                          ];
                        }, [] as Reaction[])
                      }
                    : message
                )
              }
            : conversation
        )
      };
    case ConversationsTypes.EditConversationMessage:
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === payload.conversationId
            ? {
                ...conversation,
                messages: conversation.messages.map((message) =>
                  message.id === payload.messageId
                    ? {
                        ...message,
                        content: payload.content
                      }
                    : message
                )
              }
            : conversation
        )
      };
    case ConversationsTypes.SetMessagePin:
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === payload.conversationId
            ? {
                ...conversation,
                messages: conversation.messages.map((message) =>
                  message.id === payload.messageId
                    ? {
                        ...message,
                        is_pinned: payload.is_pinned
                      }
                    : message
                )
              }
            : conversation
        )
      };
    default:
      return state;
  }
};

interface IContext extends ConversationsState {
  dispatch: Dispatch<ConversationsAction>;
}

interface ProviderProps {
  children: React.ReactNode;
}

export const ConversationsContext = createContext<IContext>({
  ...initialState,
  dispatch: () => null
});

export const useConversations = () => {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error(
      'useConversations must be used within a ConversationsProvider'
    );
  }
  return context;
};

export const ConversationsProvider: React.FC<ProviderProps> = ({
  children
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ConversationsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ConversationsContext.Provider>
  );
};
