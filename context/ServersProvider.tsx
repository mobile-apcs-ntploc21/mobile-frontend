import { Server } from '@/types';
import { createContext, ReactNode, useReducer } from 'react';

// Types
enum Actions {
  SELECT_SERVER = 'SELECT_SERVER',
  SET_SERVERS = 'SET_SERVERS'
}

type ServersState = {
  servers: Server[];
  currentServerIndex: number;
};

type ServerAction = {
  type: string;
  payload?: any;
};

interface IServersContext extends ServersState {
  selectServer: (index: number) => void;
  setServers: (newServers: Server[]) => void;
}

interface ServersProviderProps {
  children: ReactNode;
}

// Initial state
const initialState: ServersState = {
  servers: [],
  currentServerIndex: -1
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
    currentServerIndex: payload
  }),
  [Actions.SET_SERVERS]: (state, { payload }) => ({
    ...state,
    servers: payload
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

  const selectServer = (index: number) => {
    if (index < 0 || index >= state.servers.length) {
      throw new Error('Invalid server index');
    }
    dispatch({ type: Actions.SELECT_SERVER, payload: index });
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
