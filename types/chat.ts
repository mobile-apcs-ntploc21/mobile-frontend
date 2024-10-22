export type Reaction = {
  emoji_id: string;
  reactors: string[];
  count: number;
};

export type Message = {
  id: string;
  sender_id: string;
  author: {
    user_id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
  content: string;
  replied_message: {
    id: string;
    sender_id: string;
    content: string;
    is_deleted: boolean;
  } | null;
  is_modified: boolean;
  createdAt: string;
  reactions: Reaction[];
};

export type ChannelConversation = {
  id: string;
  type: 'channel';
  messages: Message[];
  number_of_unread_mentions: number;
  has_new_message: boolean;
};

export type DirectConversation = {
  id: string;
  type: 'direct';
  messages: Message[];
  number_of_unread_mentions: number;
  has_new_message: boolean;
};

export type Conversation = ChannelConversation | DirectConversation;

export enum ConversationsTypes {
  SetFocus = 'SET_FOCUS',
  AddConversation = 'ADD_CONVERSATION',
  SetConversation = 'SET_CONVERSATION',
  PatchConversation = 'PATCH_CONVERSATION',
  IncrementUnreadMentions = 'INCREMENT_UNREAD_MENTIONS',
  AddConversations = 'ADD_CONVERSATIONS',
  RemoveConversation = 'REMOVE_CONVERSATION',
  AddConversationMessage = 'ADD_CONVERSATION_MESSAGE',
  AddConversationMessageHistory = 'ADD_CONVERSATION_MESSAGE_HISTORY',
  SetConversationMessage = 'SET_CONVERSATION_MESSAGE',
  SetConversationMessages = 'SET_CONVERSATION_MESSAGES',
  DeleteConversationMessage = 'REMOVE_CONVERSATION_MESSAGE',
  // AddMessageReaction = 'ADD_MESSAGE_REACTION',
  // RemoveMessageReaction = 'REMOVE_MESSAGE_REACTION',
  SetMessageReaction = 'SET_MESSAGE_REACTION',
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

export type PatchConversationAction = {
  type: ConversationsTypes.PatchConversation;
  payload: {
    conversationId: string;
    patch: Partial<Conversation>;
  };
};

export type IncrementUnreadMentionsAction = {
  type: ConversationsTypes.IncrementUnreadMentions;
  payload: {
    conversationId: string;
    number: number;
  };
};

export type SetConversationAction = {
  type: ConversationsTypes.SetConversation;
  payload: {
    conversation: Conversation;
  };
};

export type AddConversationsAction = {
  type: ConversationsTypes.AddConversations;
  payload: {
    conversations: Conversation[];
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

export type SetConversationMessageAction = {
  type: ConversationsTypes.SetConversationMessage;
  payload: {
    conversationId: string;
    message: Message;
  };
};

export type SetConversationMessagesAction = {
  type: ConversationsTypes.SetConversationMessages;
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

// export type AddMessageReactionAction = {
//   type: ConversationsTypes.AddMessageReaction;
//   payload: {
//     conversationId: string;
//     messageId: string;
//     reaction: Reaction;
//   };
// };

// export type RemoveMessageReactionAction = {
//   type: ConversationsTypes.RemoveMessageReaction;
//   payload: {
//     conversationId: string;
//     messageId: string;
//     emojiId: string;
//   };
// };

export type SetMessageReactionAction = {
  type: ConversationsTypes.SetMessageReaction;
  payload: {
    conversationId: string;
    messageId: string;
    reactions: Reaction[];
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
  | SetConversationAction
  | PatchConversationAction
  | IncrementUnreadMentionsAction
  | AddConversationsAction
  | RemoveConversationAction
  | AddConversationMessageAction
  | AddConversationMessageHistoryAction
  | SetConversationMessageAction
  | SetConversationMessagesAction
  | RemoveConversationMessageAction
  // | AddMessageReactionAction
  // | RemoveMessageReactionAction
  | SetMessageReactionAction
  | EditConversationMessageAction;
