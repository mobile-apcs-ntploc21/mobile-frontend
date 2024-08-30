import { StatusType } from './user_status';

export interface IconProps {
  color?: string;
}

export interface Server {
  id: string;
  name: string;
  position?: number;
  is_favorite?: boolean;
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
}

export interface UserStatus {
  user_id: string;
  is_online: boolean;
  last_seen: Date;
  type: StatusType;
  status_text?: string;
}

export interface ServerProfile extends UserProfile {
  status: {
    is_online: boolean;
    last_seen: Date;
    type: StatusType;
    status_text?: string;
  };
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
  memberRemoved = 'MEMBER_REMOVED'
}
