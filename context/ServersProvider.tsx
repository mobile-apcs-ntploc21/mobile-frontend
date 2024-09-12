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
  serverMap: Record<string, Server | null>;
  currentServerId: string | null;
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
  serverMap: {},
  currentServerId: null
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
      servers: payload
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

// const fetchRoles = async (serverId: string) => {
//   try {
//     const response = await getData(`/api/v1/servers/${serverId}/roles`);
//     return response;
//   } catch (e: any) {
//     console.error(e.message);
//     return [];
//   }
// };

// Provider
export const ServersProvider = ({ children }: ServersProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
