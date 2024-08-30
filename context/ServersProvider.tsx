import { SERVER_SUBSCRIPTION } from '@/services/graphql/subscriptions';
import {
  ProfileStatus,
  Server,
  ServerEvents,
  UserProfile,
  UserStatus
} from '@/types';
import { getData } from '@/utils/api';
import { useSubscription } from '@apollo/client';
import { createContext, ReactNode, useEffect, useReducer, useRef } from 'react';

// Types
enum Actions {
  SELECT_SERVER = 'SELECT_SERVER',
  SET_SERVERS = 'SET_SERVERS',
  SET_CATEGORIES = 'SET_CATEGORIES',
  SET_MEMBERS = 'SET_MEMBERS',
  SET_ROLES = 'SET_ROLES',
  UPDATE_STATUS = 'UPDATE_STATUS',
  UPDATE_PROFILE = 'UPDATE_PROFILE'
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

type Role = {
  id: string;
  name: string;
  color: string;
};

type ServersState = {
  servers: Server[];
  currentServerId: string | null;
  categories: Category[];
  members: ProfileStatus[];
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
  setCategories: (categories: Category[]) => void;
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
  setCategories: () => {},
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
  },
  [Actions.UPDATE_STATUS]: (state, { payload }) => {
    return {
      ...state,
      members: state.members.map((member) =>
        member.user_profile.user_id === payload.user_id
          ? {
              ...member,
              user_status: {
                ...member.user_status,
                ...payload
              }
            }
          : member
      )
    };
  },
  [Actions.UPDATE_PROFILE]: (state, { payload }) => {
    return {
      ...state,
      members: state.members.map((member) =>
        member.user_profile.user_id === payload.user_id
          ? {
              ...member,
              user_profile: {
                ...member.user_status,
                ...payload
              }
            }
          : member
      )
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
  const { data: subscriptionData } = useSubscription(SERVER_SUBSCRIPTION, {
    variables: { server_id: state.currentServerId },
    skip: !state.currentServerId
  });

  useEffect(() => {
    if (!subscriptionData) return;
    const { serverUpdated } = subscriptionData;
    switch (serverUpdated.type) {
      case ServerEvents.userStatusChanged:
        dispatch({ type: Actions.UPDATE_STATUS, payload: serverUpdated.data });
        break;
      case ServerEvents.userProfileChanged:
        dispatch({ type: Actions.UPDATE_PROFILE, payload: serverUpdated.data });
        break;
    }
  }, [subscriptionData, dispatch]);

  const selectServer = async (id: string) => {
    try {
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

      const members = await getData(`/api/v1/servers/${id}/members`);

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
    } catch (err: any) {
      throw new Error(err.message);
    }
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
      value={{
        ...state,
        selectServer,
        setServers,
        setCategories,
        dispatch
      }}
    >
      {children}
    </ServersContext.Provider>
  );
};
