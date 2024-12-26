import { Emoji, Role } from './server';
import { StatusType } from './user_status';

export interface IconProps {
  color?: string;
  strokeWidth?: number;
}

export interface Server {
  id: string;
  owner_id: string;
  name: string;
  avatar?: string | null;
  banner?: string | null;
  position?: number;
  is_favorite?: boolean;
  emojis?: Emoji[];
}

export interface ServerItemProps {
  id: string;
  onPress?: (id: string) => void;
}

export interface ServerListProps {
  servers: Server[];
  onChange: (id: string) => void;
  currentServerId: string;
}

export interface UserProfile {
  user_id: string;
  display_name: string;
  username: string;
  about_me: string;
  avatar_url: string;
  banner_url: string;
  status: {
    is_online: boolean;
    last_seen: Date;
    type: StatusType;
    status_text?: string;
  };
}

export interface UserStatus {
  user_id: string;
  is_online: boolean;
  last_seen: Date;
  type: StatusType;
  status_text?: string;
}

export interface ServerProfile extends UserProfile {
  roles: Role[];
}

export enum ServerEvents {
  userProfileChanged = 'USER_PROFILE_CHANGED',
  userStatusChanged = 'USER_STATUS_CHANGED',

  memberJoined = 'MEMBER_JOINED',
  memberLeft = 'MEMBER_LEFT',
  memberUpdated = 'MEMBER_UPDATED',

  emojiAdded = 'EMOJI_ADDED',
  emojiUpdated = 'EMOJI_UPDATED',
  emojiDeleted = 'EMOJI_DELETED',

  serverUpdated = 'SERVER_UPDATED',
  serverDeleted = 'SERVER_DELETED',

  memberAdded = 'MEMBER_ADDED',
  memberRemoved = 'MEMBER_REMOVED',

  userRoleAdded = 'ADD_USER_TO_ROLE',
  userRoleDeleted = 'REMOVE_USER_FROM_ROLE',

  channelAdded = 'CHANNEL_ADDED',
  channelDeleted = 'CHANNEL_DELETED',
  channelUpdated = 'CHANNEL_UPDATED',

  categoryAdded = 'CATEGORY_ADDED',
  categoryDeleted = 'CATEGORY_DELETED',
  categoryUpdated = 'CATEGORY_UPDATED',

  roleAdded = 'ROLE_ADDED',
  roleDeleted = 'ROLE_DELETED',
  roleUpdated = 'ROLE_UPDATED',

  messageAdded = 'NEW_MESSAGE',
  messageDeleted = 'MESSAGE_DELETED',
  messageEdited = 'MESSAGE_MODIFIED',
  messagePinAdded = 'NEW_MESSAGE_PINNED',
  messagePinRemoved = 'MESSAGE_UNPINNED',
  messageReactionAdded = 'REACTION_ADDED',
  messageReactionRemoved = 'REACTION_REMOVED',
  messageMentionedUser = 'USER_MENTIONED',
  messageMentionedRole = 'ROLE_MENTIONED',

  channelRoleAdded = 'ADD_CHANNEL_PERMISSIONS_TO_ROLE',
  channelRoleDeleted = 'REMOVE_CHANNEL_PERMISSIONS_FROM_ROLE',
  channelRoleUpdated = 'UPDATE_CHANNEL_PERMISSIONS_FOR_ROLE',

  categoryRoleAdded = 'ADD_CATEGORY_PERMISSIONS_TO_ROLE',
  categoryRoleDeleted = 'REMOVE_CATEGORY_PERMISSIONS_FROM_ROLE',
  categoryRoleUpdated = 'UPDATE_CATEGORY_PERMISSIONS_FOR_ROLE',

  channelUserAdded = 'ADD_CHANNEL_PERMISSIONS_TO_USER',
  channelUserDeleted = 'REMOVE_CHANNEL_PERMISSIONS_FROM_USER',
  channelUserUpdated = 'UPDATE_CHANNEL_PERMISSIONS_FOR_USER',

  categoryUserAdded = 'ADD_CATEGORY_PERMISSIONS_TO_USER',
  categoryUserDeleted = 'REMOVE_CATEGORY_PERMISSIONS_FROM_USER',
  categoryUserUpdated = 'UPDATE_CATEGORY_PERMISSIONS_FOR_USER'
}
