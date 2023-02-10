export type FormUser = {
  username: string;
  password: string;
};

export type Order = {
  id: number;
  order: number;
};

export type ItemData = {
  id: number;
  safety_group_id: number;
  name: string;
  password: string;
  order: number;
  created_on: string;
};

export type GroupData = {
  id: number;
  group_name: string;
  order: number;
  created_on: string;
  items: ItemData[];
};
