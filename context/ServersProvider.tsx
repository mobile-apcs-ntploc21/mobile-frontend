import { Server } from '@/types';
import { createContext, ReactNode, useReducer } from 'react';

// Types
enum Actions {
  SELECT_SERVER = 'SELECT_SERVER',
  SET_SERVERS = 'SET_SERVERS'
}

type ServersState = {
  servers: Server[];
  currentServerId: string | null;
};

type ServerAction = {
  type: string;
  payload?: any;
};

interface IServersContext extends ServersState {
  selectServer: (id: string) => void;
  setServers: (newServers: Server[]) => void;
}

interface ServersProviderProps {
  children: ReactNode;
}

// Initial state
const initialState: ServersState = {
  servers: [],
  currentServerId: null
};

// Context
export const ServersContext = createContext<IServersContext>({
  ...initialState,
  selectServer: () => {},
  setServers: () => {}
});

// Handlers
const handlers: Record<
  string,
  (state: ServersState, action: ServerAction) => ServersState
> = {
  [Actions.SELECT_SERVER]: (state, { payload }) => ({
    ...state,
    currentServerId: payload
  }),
  [Actions.SET_SERVERS]: (state, { payload }) => ({
    ...state,
    servers: payload,
    currentServerId:
      payload.length === 0
        ? null
        : state.servers.length === 0
        ? payload[1].id
        : state.currentServerId
  })
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
    if (state.servers.findIndex((server) => server.id === id) === -1) {
      throw new Error(`Server with id ${id} not found`);
    }
    dispatch({ type: Actions.SELECT_SERVER, payload: id });
  };

  const setServers = (newServers: Server[]) => {
    dispatch({ type: Actions.SET_SERVERS, payload: newServers });
  };

  return (
    <ServersContext.Provider value={{ ...state, selectServer, setServers }}>
      {children}
    </ServersContext.Provider>
  );
};
