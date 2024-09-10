export interface Channel {
  id: string;
  name: string;
  description: string;
  position: number;

  is_archived: boolean;
  is_nsfw: boolean;
}

export interface Category {
  id: string | null;
  name: string;
  channels: Channel[];
  position: number;
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

export interface Emoji {
  id: string;
  name: string;
  image_url: string;
  uploader_id: string;
}
