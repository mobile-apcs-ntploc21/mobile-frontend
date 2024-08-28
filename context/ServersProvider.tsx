import { Server } from '@/types';
import { createContext, ReactNode, useEffect, useReducer, useRef } from 'react';

// Types
enum Actions {
  SELECT_SERVER = 'SELECT_SERVER',
  SET_SERVERS = 'SET_SERVERS',
  SET_CATEGORIES = 'SET_CATEGORIES',
  SET_MEMBERS = 'SET_MEMBERS',
  SET_ROLES = 'SET_ROLES'
}

type Channel = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
  channels: Channel[];
};

type Member = {
  id: string;
  username: string;
  avatar?: string;
};

type Role = {
  id: string;
  name: string;
  color: string;
};

type ServersState = {
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
  dispatch: React.Dispatch<ServerAction>;
}

interface ServersProviderProps {
  children: ReactNode;
}

// Initial state
const initialState: ServersState = {
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
  dispatch: () => {}
});

// Handlers
const handlers: Record<
  string,
  (state: ServersState, action: ServerAction) => ServersState
> = {
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

// Provider
export const ServersProvider = ({ children }: ServersProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
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

    const members: Member[] = Array.from({ length: 10 }, (_, i) => ({
      id: i.toString(),
      username: `user_${i}`
    }));

    const roles: Role[] = Array.from({ length: 10 }, (_, i) => ({
      id: i.toString(),
      name: `role_${i}`,
      color: `#${
        Math.floor(Math.random() * 16777215).toString(16) // random color
      }`
    }));
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

  return (
    <ServersContext.Provider
      value={{
        ...state,
        selectServer,
        setServers,
        dispatch
      }}
    >
      {children}
    </ServersContext.Provider>
  );
};
