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

// Provider
export const ServersProvider = ({ children }: ServersProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
