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
