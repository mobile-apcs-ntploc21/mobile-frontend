export interface IconProps {
  color?: string;
}

export interface Server {
  id: string;
  name: string;
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
