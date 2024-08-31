import { SERVER_SUBSCRIPTION } from '@/services/graphql/subscriptions';
import { ProfileStatus, ServerEvents } from '@/types';
import { getData } from '@/utils/api';
import { useSubscription } from '@apollo/client';
import {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer
} from 'react';

export enum ServerActions {
  INIT = 'INIT',
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

type ServerState = {
  latestAction: ServerActions | null;
  server_id: string | null;
  categories: Category[];
  members: ProfileStatus[];
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
  [ServerActions.INIT]: (_, { payload }) => payload,
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
        member.user_profile.user_id === payload.user_id
          ? JSON.parse(JSON.stringify({ ...member, user_status: payload }))
          : member
      )
    };
  },
  [ServerActions.UPDATE_PROFILE]: (state, { payload }) => {
    return {
      ...state,
      latestAction: ServerActions.UPDATE_PROFILE,
      members: state.members.map((member) =>
        member.user_profile.user_id === payload.user_id
          ? JSON.parse(JSON.stringify({ ...member, user_profile: payload }))
          : member
      )
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data: subscriptionData } = useSubscription(SERVER_SUBSCRIPTION, {
    variables: { server_id: state.server_id },
    skip: !state.server_id
  });

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
    }
  }, [subscriptionData, dispatch]);

  const setServer = async (id: string) => {
    try {
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

      dispatch({
        type: ServerActions.INIT,
        payload: {
          server_id: id,
          categories,
          members,
          roles
        }
      });
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    if (props.server_id) setServer(props.server_id);
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
