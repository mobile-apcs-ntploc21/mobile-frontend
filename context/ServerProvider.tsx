import { SERVER_SUBSCRIPTION } from '@/services/graphql/subscriptions';
import { ServerEvents, ServerProfile } from '@/types';
import { getData } from '@/utils/api';
import { useSubscription } from '@apollo/client';
import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';

export enum ServerActions {
  INIT = 'INIT',
  SET_CATEGORIES = 'SET_CATEGORIES',
  SET_MEMBERS = 'SET_MEMBERS',
  SET_ROLES = 'SET_ROLES',
  UPDATE_STATUS = 'UPDATE_STATUS',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  CREATE_CHANNEL = 'CREATE_CHANNEL',
  UPDATE_CHANNEL = 'UPDATE_CHANNEL',
  CREATE_CATEGORY = 'CREATE_CATEGORY'
}

type Channel = {
  id: string;
  name: string;
  description: string;
  position: number;

  is_archived: boolean;
  is_nsfw: boolean;
};

type Category = {
  id: string | null;
  name: string;
  channels: Channel[];
  position: number;
};

type Role = {
  id: string;
  name: string;
  color: string;
};

type ServerState = {
  latestAction: ServerActions | null;
  server_id: string | null;
  categories: Category[];
  members: ServerProfile[];
  roles: Role[];
};

type ServerAction = {
  type: ServerActions;
  payload: any;
};

interface IContext extends ServerState {
  setServer: (id: string) => Promise<void>;
  dispatch: Dispatch<ServerAction>;
}

interface ProviderProps {
  server_id: string | null;
  children: ReactNode;
}

const initialState: ServerState = {
  latestAction: null,
  server_id: null,
  categories: [],
  members: [],
  roles: []
};

const handlers: Record<
  string,
  (state: ServerState, action: ServerAction) => ServerState
> = {
  [ServerActions.INIT]: (_, { payload }) => {
    return {
      ...payload,
      latestAction: ServerActions.INIT
    };
  },
  [ServerActions.SET_CATEGORIES]: (state, { payload }) => {
    return {
      ...state,
      latestAction: ServerActions.SET_CATEGORIES,
      categories: payload
    };
  },
  [ServerActions.SET_MEMBERS]: (state, { payload }) => {
    return {
      ...state,
      latestAction: ServerActions.SET_MEMBERS,
      members: payload
    };
  },
  [ServerActions.SET_ROLES]: (state, { payload }) => {
    return {
      ...state,
      latestAction: ServerActions.SET_ROLES,
      roles: payload
    };
  },
  [ServerActions.UPDATE_STATUS]: (state, { payload }) => {
    return {
      ...state,
      latestAction: ServerActions.UPDATE_STATUS,
      members: state.members.map((member) =>
        member.user_id === payload.user_id
          ? { ...member, status: payload }
          : member
      )
    };
  },
  [ServerActions.UPDATE_PROFILE]: (
    state,
    { payload: { status, ...profile } }
  ) => {
    return {
      ...state,
      latestAction: ServerActions.UPDATE_PROFILE,
      members: state.members.map((member) =>
        member.user_id === profile.user_id ? { ...member, ...profile } : member
      )
    };
  },
  [ServerActions.CREATE_CHANNEL]: (state, { payload }) => {
    const newState = { ...state };

    if (newState.categories[0].id === null) {
      newState.categories[0].channels.push(payload);
    } else {
      console.log('What happen here?');
      throw new Error('Something is wrong and we cannot find it.');
    }

    return {
      ...newState,
      latestAction: ServerActions.CREATE_CHANNEL
    };
  },
  [ServerActions.CREATE_CATEGORY]: (state, { payload }) => {
    return {
      ...state,
      latestAction: ServerActions.CREATE_CATEGORY,
      categories: [...state.categories, payload]
    };
  },
  [ServerActions.UPDATE_CHANNEL]: (state, { payload }) => {
    return {
      ...state,
      latestAction: ServerActions.UPDATE_CHANNEL,
      categories: payload
    };
  }
};

const reducer = (state: ServerState, action: ServerAction) => {
  const handler = handlers[action.type];
  if (!handler) {
    throw new Error(`Invalid action type: ${action.type}`);
  }
  return handler(state, action);
};

export const ServerContext = createContext<IContext>({
  ...initialState,
  setServer: () => Promise.resolve(),
  dispatch: () => {}
});

export const ServerProvider = (props: ProviderProps) => {
  const activeServerIdRef = useRef<String | null>(null);
  const [servers, setServers] = useState<Record<string, ServerState>>({});
  const [state, dispatch] = useReducer(reducer, initialState);
  const fetchedServerIds = Object.keys(servers);
  const { data: subscriptionData } = useSubscription(SERVER_SUBSCRIPTION, {
    variables: { server_id: fetchedServerIds },
    skip: fetchedServerIds.length === 0
  });

  const getServerProfile = useCallback(
    async (id: string, fromServer?: boolean) => {
      try {
        if (fromServer && !state.server_id)
          throw new Error('Server ID is null');
        const user_profile = await getData(
          fromServer
            ? `/api/v1/profile/${id}/${state.server_id}`
            : `/api/v1/profile/${id}`
        );
        const user_status = await getData(`/api/v1/status/${id}`);
        return {
          ...user_profile,
          status: user_status
        };
      } catch (e: any) {
        throw new Error(e.message);
      }
    },
    [state.server_id]
  );

  useEffect(() => {
    if (!subscriptionData) return;
    const { serverUpdated } = subscriptionData;
    switch (serverUpdated.type) {
      case ServerEvents.userStatusChanged:
        dispatch({
          type: ServerActions.UPDATE_STATUS,
          payload: serverUpdated.data
        });
        break;
      case ServerEvents.userProfileChanged:
        dispatch({
          type: ServerActions.UPDATE_PROFILE,
          payload: serverUpdated.data
        });
        break;
      case ServerEvents.memberJoined:
        (async () => {
          let profileAndStatus = await getServerProfile(
            serverUpdated.data,
            true
          );
          if (!profileAndStatus)
            profileAndStatus = await getServerProfile(serverUpdated.data);
          dispatch({
            type: ServerActions.SET_MEMBERS,
            payload: [...state.members, profileAndStatus]
          });
        })();
        break;
      case ServerEvents.memberLeft:
        dispatch({
          type: ServerActions.SET_MEMBERS,
          payload: state.members.filter(
            (member) => member.user_id !== serverUpdated.data.user_id
          )
        });
        break;
      case ServerEvents.memberAdded:
        (async () => {
          const profileAndStatus = await Promise.all(
            // @ts-ignore
            serverUpdated.data.map((user_id) =>
              getServerProfile(user_id, true).catch(() =>
                getServerProfile(user_id)
              )
            )
          );
          dispatch({
            type: ServerActions.SET_MEMBERS,
            payload: [...state.members, ...profileAndStatus]
          });
        })();
        break;
      case ServerEvents.memberRemoved:
        // @ts-ignore
        dispatch({
          type: ServerActions.SET_MEMBERS,
          payload: state.members.filter(
            (member) => !serverUpdated.data.includes(member.user_id)
          )
        });
        break;
    }
  }, [subscriptionData, dispatch]);

  // Fetch server data
  const fetchServerData = async (server_id: string) => {
    if (servers[server_id]) return servers[server_id];

    try {
      const channelsFetch = (
        await getData(`/api/v1/servers/${server_id}/channels`)
      )?.channels;
      const categoriesFetch = (
        await getData(`/api/v1/servers/${server_id}/categories`)
      )?.categories;
      const membersFetch = await getData(
        `/api/v1/servers/${server_id}/members`
      );
      // const rolesFetch = await getData(`/api/v1/servers/${server_id}/roles`);

      const categories: Category[] = categoriesFetch.map(
        (category: any, index: number) => {
          return {
            id: category.id,
            name: category.name,
            channels: channelsFetch.filter(
              (channel: any) => channel.category_id === category.id
            ),
            position: index + 1
          };
        }
      );

      // Add a separate category for uncategorized channels
      // if (channelsFetch.some((channel: any) => !channel.category_id)) {
      categories.unshift({
        id: null,
        name: 'Uncategorized',
        channels: channelsFetch.filter((channel: any) => !channel.category_id),
        position: 0
      });
      // }

      const roles: Role[] = Array.from({ length: 10 }, (_, i) => ({
        id: i.toString(),
        name: `role_${i}`,
        color: `#${
          Math.floor(Math.random() * 16777215).toString(16) // random color
        }`
      }));

      const updatedServer = {
        latestAction: ServerActions.INIT,
        server_id: server_id,
        categories: categories,
        members: membersFetch,
        roles: roles
      };

      setServers((prevServers) => ({
        ...prevServers,
        [server_id]: updatedServer
      }));

      return updatedServer;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const setServer = async (server_id: string) => {
    // Dispatch an action to reset the state
    dispatch({
      type: ServerActions.INIT,
      payload: initialState
    });

    try {
      // Fetch server data and update the state
      const currentServer = await fetchServerData(server_id);

      if (String(activeServerIdRef.current).match(server_id)) {
        if (server_id !== state.server_id) {
          dispatch({
            type: ServerActions.INIT,
            payload: currentServer
          });
        }
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    if (props.server_id) {
      activeServerIdRef.current = props.server_id;
      setServer(props.server_id);
    }
  }, [props.server_id]);

  return (
    <ServerContext.Provider
      value={{
        ...state,
        setServer,
        dispatch
      }}
    >
      {props.children}
    </ServerContext.Provider>
  );
};
