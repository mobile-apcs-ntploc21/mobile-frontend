import { Server } from '@/types';
import {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
  useRef
} from 'react';
import { ServerProvider } from './ServerProvider';

// Types
export enum ServersActions {
  SELECT_SERVER = 'SELECT_SERVER',
  SET_SERVERS = 'SET_SERVERS'
}

type ServersState = {
  servers: Server[];
  currentServerId: string | null;
  serverMap: Record<string, Server | null>;
  categories: Category[];
  members: Member[];
  roles: Role[];
};

type ServerAction = {
  type: string;
  payload?: any;
};

interface IServersContext extends ServersState {
  dispatch: Dispatch<ServerAction>;
}

interface ServersProviderProps {
  children: ReactNode;
}

// Initial state
const initialState: ServersState = {
  servers: [],
  currentServerId: null,
  serverMap: {},
  categories: [],
  members: [],
  roles: []
};

// Context
export const ServersContext = createContext<IServersContext>({
  ...initialState,
  dispatch: () => {}
});

// Handlers
const handlers: Record<
  string,
  (state: ServersState, action: ServerAction) => ServersState
> = {
  [ServersActions.SELECT_SERVER]: (state, { payload }) => {
    return {
      ...state,
      currentServerId: payload
    };
  },
  [ServersActions.SET_SERVERS]: (state, { payload }) => {
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
  },
  default: (state) => state
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

  const setCategories = (categories: Category[]) => {
    dispatch({ type: Actions.SET_CATEGORIES, payload: categories });
  };

  // Set server map for quick access using its id
  state.serverMap = state.servers.reduce(
    (acc, server) => {
      acc[server.id] = server;
      return acc;
    },
    { null: null } as Record<string, Server | null>
  );

  return (
    <ServersContext.Provider
      value={{
        ...state,
        dispatch
      }}
    >
      <ServerProvider server_id={state.currentServerId}>
        {children}
      </ServerProvider>
    </ServersContext.Provider>
  );
};
