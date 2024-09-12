import { Conversation, ConversationsTypes } from '@/types/chat';
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
    case ConversationsTypes.AddMessageReaction:
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
                        reactions: [...message.reactions, payload.reaction]
                      }
                    : message
                )
              }
            : conversation
        )
      };
    case ConversationsTypes.RemoveMessageReaction:
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
                        reactions: message.reactions.filter(
                          (reaction) => reaction.id !== payload.reactionId
                        )
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
