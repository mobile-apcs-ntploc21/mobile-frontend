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
import { useSubscription } from '@apollo/client';
import { DUMMY_SUBSCRIPTION } from '@/services/graphql/subscriptions';
import { useAuth } from './AuthProvider';
import { getData } from '@/utils/api';

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
  const { user } = useAuth();

  const { data: userSubData } = useSubscription(DUMMY_SUBSCRIPTION, {
    variables: { user_id: user?.id },
    skip: !user?.id
  });

  const handleUserSubscription = async (subscriptionData: any) => {
    console.log('subscriptionData', subscriptionData);
    if (!subscriptionData) return;

    const { _: userData } = subscriptionData;
    const { type, data } = userData;

    if (!userData) return;

    switch (type) {
      case 'SERVER_ADDED':
      case 'SERVER_REMOVED':
        {
          const response = await getData('/api/v1/servers/list'); // return JSON array of servers

          if (!response) {
            dispatch({ type: ServersActions.SET_SERVERS, payload: [] }); // Set empty array if no servers
            return;
          }

          const servers = await Promise.all(
            Object.values(response).map(async (server: any, index: number) => {
              return {
                id: server.id,
                owner_id: server.owner,
                name: server.name,
                is_favorite: server.is_favorite,
                avatar: server.avatar_url,
                banner: server.banner_url,
                position: server.position || index
              };
            })
          );

          if (Array.isArray(servers)) {
            console.log('servers', servers);
            dispatch({
              type: ServersActions.SET_SERVERS,
              payload: servers
            });
          }
        }
        break;

      default: {
        console.warn('Unknown type', type);
        console.log(data);
      }
    }
  };

  useEffect(() => {
    handleUserSubscription(userSubData);
  }, [userSubData]);

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
      <ServerProvider
        server_id={state.currentServerId}
        serversList={state.servers}
        dispatch={dispatch}
      >
        {children}
      </ServerProvider>
    </ServersContext.Provider>
  );
};
