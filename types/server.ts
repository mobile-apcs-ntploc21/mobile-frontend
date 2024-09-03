export interface Channel {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  channels: Channel[];
}

export interface Role {
  id: string;
  name: string;
  color: string;
  allow_anyone_mention: boolean;
  position: number;
  permissions: string;
  is_admin: boolean;
  default: boolean;
  number_of_users: number;
}
