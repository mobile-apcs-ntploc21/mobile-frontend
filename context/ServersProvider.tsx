import { Server } from '@/types';
import { createContext, ReactNode, useReducer } from 'react';

// Types
enum Actions {
  SELECT_SERVER = 'SELECT_SERVER',
  SET_SERVERS = 'SET_SERVERS',
  SET_CATEGORIES = 'SET_CATEGORIES'
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

type ServersState = {
  servers: Server[];
  currentServerId: string | null;
  categories: Category[];
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
}

interface ServersProviderProps {
  children: ReactNode;
}

// Initial state
const initialState: ServersState = {
  servers: [],
  currentServerId: null,
  categories: []
};

// Context
export const ServersContext = createContext<IServersContext>({
  ...initialState,
  selectServer: () => {},
  setServers: () => {},
  setCategories: () => {}
});

// Handlers
const handlers: Record<
  string,
  (state: ServersState, action: ServerAction) => ServersState
> = {
  [Actions.SELECT_SERVER]: (state, { payload }) => {
    // fetch server with id provided
    const categories: Category[] = Array.from({ length: 5 }, (_, i) => ({
      id: i.toString(),
      name: i ? `Category ${i}` : `Uncategorized`,
      channels: Array.from({ length: 5 }, (_, j) => ({
        id: j.toString(),
        name: `Channel ${j}`
      }))
    }));

    return {
      ...state,
      currentServerId: payload,
      categories
    };
  },
  [Actions.SET_SERVERS]: (state, { payload: { newServers, isNewServer } }) => {
    // fetch server with id provided
    const categories: Category[] = Array.from({ length: 5 }, (_, i) => ({
      id: i.toString(),
      name: i ? `Category ${i}` : `Uncategorized`,
      channels: Array.from({ length: 5 }, (_, j) => ({
        id: j.toString(),
        name: `Channel ${j}`
      }))
    }));
    return {
      ...state,
      servers: newServers,
      currentServerId:
        newServers.length === 0
          ? null
          : state.servers.length === 0 || isNewServer
          ? newServers[0].id
          : state.currentServerId,
      categories
    };
  },
  [Actions.SET_CATEGORIES]: (state, { payload }) => {
    return {
      ...state,
      categories: payload
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

  const selectServer = (id: string) => {
    // Fetch server id
    if (state.servers.findIndex((server) => server.id === id) === -1) {
      throw new Error(`Server with id ${id} not found`);
    }
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
      value={{ ...state, selectServer, setServers, setCategories }}
    >
      {children}
    </ServersContext.Provider>
  );
};
