import { Server } from '@/types';
import { createContext, ReactNode, useReducer } from 'react';

// Types
enum Actions {
  SET_SERVER_ID = 'SET_SERVER_ID'
}

type ServerState = {
  id: string;
  owner: string;
  name: string;
  avatar_url: string;
  banner_url: string;
  totalMembers: number;
  totalEmojis: number;
};

type ServerAction = {
  type: string;
  payload?: any;
};

interface IServerContext extends ServerState {
  setServerId: (id: string) => void;
}

interface ServerProviderProps {
  children: ReactNode;
}

// Initial state
const initialState: ServerState = {
  id: '',
  owner: '',
  name: '',
  avatar_url: '',
  banner_url: '',
  totalMembers: 0,
  totalEmojis: 0
};

// Context
export const ServerContext = createContext<IServerContext>({
  ...initialState,
  setServerId: () => {}
});

// Handlers
const handlers: Record<
  string,
  (state: ServerState, action: ServerAction) => ServerState
> = {
  [Actions.SET_SERVER_ID]: (state, { payload }) => {
    // Fetch server data
    return {
      ...state,
      id: payload
    };
  }
};

// Reducer
const reducer = (state: ServerState, action: ServerAction) => {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
};

// Provider
export const ServerProvider = ({ children }: ServerProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setServerId = (id: string) => {
    dispatch({ type: Actions.SET_SERVER_ID, payload: id });
  };

  return (
    <ServerContext.Provider value={{ ...state, setServerId }}>
      {children}
    </ServerContext.Provider>
  );
};
