import { Server } from '@/types';
import { getData } from '@/utils/api';
import { createContext, ReactNode, useEffect, useReducer, useRef } from 'react';

// Types
export enum Actions {
  SET_CALLBACK = 'SET_CALLBACK',
  SELECT_SERVER = 'SELECT_SERVER',
  SET_SERVERS = 'SET_SERVERS',
  SET_CATEGORIES = 'SET_CATEGORIES',
  SET_MEMBERS = 'SET_MEMBERS',
  SET_ROLES = 'SET_ROLES'
}

export type Channel = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  channels: Channel[];
};

export type Member = {
  id: string;
  display_name: string;
  username: string;
  avatar?: string;
};

export type Role = {
  id: string;
  name: string;
  color: string;
  allowMention?: boolean;
  memberCount?: number;
};

export const responseToRoles = (response: any): Role[] => {
  if (!response.roles) return [];
  return response.roles
    .filter((role: any) => role.default === false)
    .map((role: any) => ({
      id: role.id,
      name: role.name,
      color: role.color,
      allowMention: role.allow_anyone_mention,
      memberCount: role.number_of_users
    }));
};

type ServersState = {
  callback: (...args: any[]) => void;
  servers: Server[];
  currentServerId: string | null;
  categories: Category[];
  members: Member[];
  roles: Role[];
};

type ServerAction = {
  type: string;
  payload?: any;
};

interface IServersContext extends ServersState {
  selectServer: (id: string) => void;
  setServers: (
    newServers: Server[],
    isForPositions?: boolean,
    isNewServer?: boolean
  ) => void;
  setCategories: (categories: Category[]) => void;
  dispatch: React.Dispatch<ServerAction>;
}

interface ServersProviderProps {
  children: ReactNode;
}

// Initial state
const initialState: ServersState = {
  callback: () => {},
  servers: [],
  currentServerId: null,
  categories: [],
  members: [],
  roles: []
};

// Context
export const ServersContext = createContext<IServersContext>({
  ...initialState,
  selectServer: () => {},
  setServers: () => {},
  setCategories: () => {},
  dispatch: () => {}
});

// Handlers
const handlers: Record<
  string,
  (state: ServersState, action: ServerAction) => ServersState
> = {
  [Actions.SET_CALLBACK]: (state, { payload }) => {
    return {
      ...state,
      callback: payload
    };
  },
  [Actions.SELECT_SERVER]: (state, { payload }) => {
    return {
      ...state,
      currentServerId: payload
    };
  },
  [Actions.SET_SERVERS]: (state, { payload: { newServers, isNewServer } }) => {
    return {
      ...state,
      servers: newServers
    };
  },
  [Actions.SET_CATEGORIES]: (state, { payload }) => {
    return {
      ...state,
      categories: payload
    };
  },
  [Actions.SET_MEMBERS]: (state, { payload }) => {
    return {
      ...state,
      members: payload
    };
  },
  [Actions.SET_ROLES]: (state, { payload }) => {
    return {
      ...state,
      roles: payload
    };
  }
};

// Reducer
const reducer = (state: ServersState, action: ServerAction) => {
  const handler = handlers[action.type];
  if (!handler) {
    throw new Error(`Invalid action type: ${action.type}`);
  }
  return handler(state, action);
};

const MockMembers: Member[] = [
  {
    id: '6690983e2a505b6209cc1c21',
    display_name: 'Bin',
    username: 'nhanbin',
    avatar:
      'https://cdn.ntploc21.xyz/avatars/a03efd8d-f71f-4123-848a-8f69fba80ab3.png", "banner_url": "https://cdn.ntploc21.xyz/banners/d37860c8-862b-4d93-b618-77612cfa41fe.png'
  },
  {
    id: '668fd2737d14368c57eabd02',
    display_name: 'abcdef',
    username: 'abcdef',
    avatar: ''
  },
  {
    id: '668ffb9d5bafe5c8fa6cec9b',
    display_name: 'ntploc21',
    username: 'ntploc21',
    avatar: ''
  },
  {
    id: '66928e2d1dea7597b1847ba1',
    display_name: 'nhphuc',
    username: 'nhphuc',
    avatar:
      'https://cdn.ntploc21.xyz/avatars/8d984bf3-4566-4b0f-893a-f17675fc5f8a.png'
  }
];

// Provider
export const ServersProvider = ({ children }: ServersProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchRoles = async (serverId: string) => {
    try {
      const response = await getData(`/api/v1/servers/${serverId}/roles`);
      return response;
    } catch (e: any) {
      console.error(e.message);
      return [];
    }
  };

  const selectServer = async (id: string) => {
    // Fetch server id
    if (state.servers.findIndex((server) => server.id === id) === -1) {
      throw new Error(`Server with id ${id} not found`);
    }
    // fetch server with id provided
    const categories: Category[] = Array.from({ length: 5 }, (_, i) => ({
      id: i.toString(),
      name: i ? `Category ${i}` : `Uncategorized`,
      channels: Array.from({ length: 5 }, (_, j) => ({
        id: j.toString(),
        name: `Channel ${j}`
      }))
    }));

    const members = MockMembers;

    const roles = responseToRoles(await fetchRoles(id));

    console.log(roles);

    dispatch({ type: Actions.SET_CATEGORIES, payload: categories });
    dispatch({ type: Actions.SET_MEMBERS, payload: members });
    dispatch({ type: Actions.SET_ROLES, payload: roles });
    dispatch({ type: Actions.SELECT_SERVER, payload: id });
  };

  const setServers = (
    newServers: Server[],
    isForPositions?: boolean,
    isNewServer?: boolean
  ) => {
    if (!isForPositions || state.servers.length === newServers.length) {
      dispatch({
        type: Actions.SET_SERVERS,
        payload: { newServers, isNewServer }
      });
    }
  };

  const setCategories = (categories: Category[]) => {
    dispatch({ type: Actions.SET_CATEGORIES, payload: categories });
  };

  return (
    <ServersContext.Provider
      value={{
        ...state,
        selectServer,
        setServers,
        setCategories,
        dispatch
      }}
    >
      {children}
    </ServersContext.Provider>
  );
};
