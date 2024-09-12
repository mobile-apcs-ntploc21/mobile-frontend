import { SERVER_SUBSCRIPTION } from '@/services/graphql/subscriptions';
import { ServerEvents, ServerProfile } from '@/types';
import { Category, Emoji, Role } from '@/types/server';
import { getData } from '@/utils/api';
import { useSubscription } from '@apollo/client';
import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useEffect,
  useReducer
} from 'react';

export enum ServerActions {
  INIT = 'INIT',
  SET_CATEGORIES = 'SET_CATEGORIES',
  SET_MEMBERS = 'SET_MEMBERS',
  SET_ROLES = 'SET_ROLES',
  SET_EMOJI = 'SET_EMOJI',
  UPDATE_STATUS = 'UPDATE_STATUS',
  UPDATE_PROFILE = 'UPDATE_PROFILE'
}

type ServerState = {
  latestAction: ServerActions | null;
  server_id: string | null;
  categories: Category[];
  members: ServerProfile[];
  defaultRole: Role | null;
  customRoles: Role[];
  roles: Role[];
  emojis: Emoji[];
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
  defaultRole: null,
  customRoles: [],
  roles: [],
  emojis: []
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
  [ServerActions.SET_EMOJI]: (state, { payload }) => {
    return {
      ...state,
      latestAction: ServerActions.SET_EMOJI,
      emojis: payload
    };
  },
  [ServerActions.SET_ROLES]: (state, { payload }) => {
    return {
      ...state,
      latestAction: ServerActions.SET_ROLES,
      roles: payload,
      customRoles: payload.filter((role: Role) => !role.default),
      defaultRole: payload.find((role: Role) => role.default) || null
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
          ).catch(() => getServerProfile(serverUpdated.data));
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
      case ServerEvents.userRoleAdded:
        {
          const members = [...state.members];
          members.forEach(
            (member) =>
              member.user_id === serverUpdated.data.user_id &&
              member.roles.push(
                state.customRoles.find(
                  (role) => role.id === serverUpdated.data.role_id
                )!
              )
          );
          dispatch({
            type: ServerActions.SET_MEMBERS,
            payload: members
          });
          dispatch({
            type: ServerActions.SET_ROLES,
            payload: state.roles.map((role) =>
              role.id === serverUpdated.data.role_id
                ? {
                    ...role,
                    number_of_users: role.number_of_users + 1
                  }
                : role
            )
          });
        }
        break;
      case ServerEvents.userRoleDeleted:
        {
          const members = [...state.members];
          members.forEach((member) => {
            if (member.user_id === serverUpdated.data.user_id)
              member.roles = member.roles.filter(
                (role) => role.id !== serverUpdated.data.role_id
              );
          });
          dispatch({
            type: ServerActions.SET_MEMBERS,
            payload: members
          });
          dispatch({
            type: ServerActions.SET_ROLES,
            payload: state.roles.map((role) =>
              role.id === serverUpdated.data.role_id
                ? {
                    ...role,
                    number_of_users: role.number_of_users - 1
                  }
                : role
            )
          });
        }
        break;
      case ServerEvents.emojiAdded:
        dispatch({
          type: ServerActions.SET_EMOJI,
          payload: [
            ...state.emojis,
            {
              id: serverUpdated.data._id,
              ...serverUpdated.data
            }
          ]
        });
        break;
      case ServerEvents.emojiUpdated:
        dispatch({
          type: ServerActions.SET_EMOJI,
          payload: state.emojis.map((emoji) =>
            emoji.id === serverUpdated.data._id
              ? { ...emoji, ...serverUpdated.data }
              : emoji
          )
        });
        break;
      case ServerEvents.emojiDeleted:
        dispatch({
          type: ServerActions.SET_EMOJI,
          payload: state.emojis.filter(
            (emoji) => emoji.id !== serverUpdated.data._id
          )
        });
        break;
      case ServerEvents.roleAdded:
        dispatch({
          type: ServerActions.SET_ROLES,
          payload: [
            ...state.roles,
            {
              id: serverUpdated.data._id,
              number_of_users: 0,
              ...serverUpdated.data
            }
          ]
        });
        break;
      case ServerEvents.roleDeleted:
        dispatch({
          type: ServerActions.SET_ROLES,
          payload: state.roles.filter(
            (role) => role.id !== serverUpdated.data._id
          )
        });
        const members = [...state.members];
        members.forEach((member) => {
          member.roles = member.roles.filter(
            (role) => role.id !== serverUpdated.data._id
          );
        });
        dispatch({
          type: ServerActions.SET_MEMBERS,
          payload: members
        });
        break;
      case ServerEvents.roleUpdated:
        dispatch({
          type: ServerActions.SET_ROLES,
          payload: state.roles.map((role) =>
            role.id === serverUpdated.data._id
              ? { ...role, ...serverUpdated.data }
              : role
          )
        });
        break;
      default:
        console.warn('Unknown event type:', serverUpdated.type);
        console.log(serverUpdated);
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

      const roles: Role[] = (await getData(`/api/v1/servers/${id}/roles`))
        .roles;
      let defaultRole: Role | null = null;
      const customRoles: Role[] = [];
      roles.forEach((role: Role) => {
        if (role.default) {
          defaultRole = role;
        } else {
          customRoles.push(role);
        }
      });

      const members = (await getData(`/api/v1/servers/${id}/members`)).map(
        (member: any) => ({
          ...member,
          roles: member.roleIds
            .map((roleId: string) =>
              customRoles.find((role: Role) => role.id === roleId)
            )
            .filter((role: any) => role)
        })
      );

      const emojis: Emoji[] = await getData(`/api/v1/servers/${id}/emojis`);

      dispatch({
        type: ServerActions.INIT,
        payload: {
          server_id: id,
          categories,
          members,
          defaultRole,
          customRoles,
          roles,
          emojis
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
