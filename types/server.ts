export type Channel = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  channels: Channel[];
};

export type Role = {
  id: string;
  name: string;
  color: string;
};
