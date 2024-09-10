export type Reaction = {
  id: string;
  sender_id: string;
};

export type Message = {
  id: string;
  sender_id: string;
  content: string;
  reactions: Reaction[];
};

export type ChannelConversation = {
  id: string;
  type: 'channel';
  messages: Message[];
  unread: number;
};

export type DirectConversation = {
  id: string;
  type: 'direct';
  messages: Message[];
  unread: number;
};

export type Conversation = ChannelConversation | DirectConversation;

export enum ConversationsTypes {
  SetFocus = 'SET_FOCUS',
  AddConversation = 'ADD_CONVERSATION',
  RemoveConversation = 'REMOVE_CONVERSATION',
  AddConversationMessage = 'ADD_CONVERSATION_MESSAGE',
  AddConversationMessageHistory = 'ADD_CONVERSATION_MESSAGE_HISTORY',
  DeleteConversationMessage = 'REMOVE_CONVERSATION_MESSAGE',
  AddMessageReaction = 'ADD_MESSAGE_REACTION',
  RemoveMessageReaction = 'REMOVE_MESSAGE_REACTION',
  EditConversationMessage = 'EDIT_CONVERSATION_MESSAGE'
}

export type SetFocusAction = {
  type: ConversationsTypes.SetFocus;
  payload: {
    conversationId: string;
  };
};

export type AddConversationAction = {
  type: ConversationsTypes.AddConversation;
  payload: {
    conversation: Conversation;
    focus: boolean;
  };
};

export type RemoveConversationAction = {
  type: ConversationsTypes.RemoveConversation;
  payload: {
    conversationId: string;
  };
};

export type AddConversationMessageAction = {
  type: ConversationsTypes.AddConversationMessage;
  payload: {
    conversationId: string;
    message: Message;
  };
};

export type AddConversationMessageHistoryAction = {
  type: ConversationsTypes.AddConversationMessageHistory;
  payload: {
    conversationId: string;
    messages: Message[];
  };
};

export type RemoveConversationMessageAction = {
  type: ConversationsTypes.DeleteConversationMessage;
  payload: {
    conversationId: string;
    messageId: string;
  };
};

export type AddMessageReactionAction = {
  type: ConversationsTypes.AddMessageReaction;
  payload: {
    conversationId: string;
    messageId: string;
    reaction: Reaction;
  };
};

export type RemoveMessageReactionAction = {
  type: ConversationsTypes.RemoveMessageReaction;
  payload: {
    conversationId: string;
    messageId: string;
    reactionId: string;
  };
};

export type EditConversationMessageAction = {
  type: ConversationsTypes.EditConversationMessage;
  payload: {
    conversationId: string;
    messageId: string;
    content: string;
  };
};

export type ConversationsAction =
  | SetFocusAction
  | AddConversationAction
  | RemoveConversationAction
  | AddConversationMessageAction
  | AddConversationMessageHistoryAction
  | RemoveConversationMessageAction
  | AddMessageReactionAction
  | RemoveMessageReactionAction
  | EditConversationMessageAction;