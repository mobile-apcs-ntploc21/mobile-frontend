import useServers from '@/hooks/useServers';
import { Server } from '@/types';
import { createContext, ReactNode, useEffect, useReducer } from 'react';

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

interface IServerContext extends ServerState {}

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
  ...initialState
});

// Handlers
const handlers: Record<
  string,
  (state: ServerState, action: ServerAction) => ServerState
> = {};

// Reducer
const reducer = (state: ServerState, action: ServerAction) => {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
};

// Provider
export const ServerProvider = ({ children }: ServerProviderProps) => {
  const { currentServerId } = useServers();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: Actions.SET_SERVER_ID, payload: currentServerId });
  }, [currentServerId]);

  return (
    <ServerContext.Provider value={{ ...state }}>
      {children}
    </ServerContext.Provider>
  );
};
