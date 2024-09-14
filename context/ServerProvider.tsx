import { SERVERS_SUBSCRIPTION } from '@/services/graphql/subscriptions';
import { Server, ServerEvents, ServerProfile } from '@/types';
import { Conversation, ConversationsTypes, Message } from '@/types/chat';
import { Category, Emoji, Role } from '@/types/server';
import { getData } from '@/utils/api';
import { useSubscription } from '@apollo/client';
import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import { useAuth } from './AuthProvider';
import { useConversations } from './ConversationsProvider';
import { responseToPermissions } from '@/utils/response';

export enum ServerActions {
  INIT = 'INIT',
  SET_CATEGORIES = 'SET_CATEGORIES',
  SET_MEMBERS = 'SET_MEMBERS',
  SET_ROLES = 'SET_ROLES',
  SET_EMOJI = 'SET_EMOJI',
  UPDATE_STATUS = 'UPDATE_STATUS',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  CREATE_CHANNEL = 'CREATE_CHANNEL',
  UPDATE_CHANNEL = 'UPDATE_CHANNEL',
  CREATE_CATEGORY = 'CREATE_CATEGORY',
  SET_PERMISSIONS = 'SET_PERMISSIONS'
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
  permissions: Record<string, boolean>;
  isAdmin: boolean;
};

type ServerAction = {
  type: ServerActions;
  payload: any;
};

interface IContext extends ServerState {
  setServer: (id: string) => Promise<void>;
  dispatch: Dispatch<ServerAction>;
  unsubscribeServer: (server_id: string) => void;
}

interface ProviderProps {
  server_id: string | null;
  serversList?: Server[];
  dispatch?: any;
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
  emojis: [],
  permissions: {},
  isAdmin: false
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
      members: state?.members.map((member) =>
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
  },
  [ServerActions.SET_PERMISSIONS]: (state, { payload }) => {
    return {
      ...state,
      latestAction: ServerActions.SET_PERMISSIONS,
      permissions: payload
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
  dispatch: () => {},
  unsubscribeServer: () => {}
});

export const ServerProvider = (props: ProviderProps) => {
  const activeServerIdRef = useRef<String | null>(null);
  const [servers, setServers] = useState<Record<string, ServerState>>({});
  const [state, dispatch] = useReducer(reducer, initialState);

  const { user } = useAuth();
  const {
    dispatch: conversationDispatch,
    focusId,
    conversations
  } = useConversations();

  const fetchedServerIds = Object.keys(servers) || [];
  const { data: subscriptionData } = useSubscription(SERVERS_SUBSCRIPTION, {
    variables: { server_ids: fetchedServerIds, user_id: user?.id },
    skip: fetchedServerIds.length === 0
  });

  const unsubscribeServer = async (server_id: string) => {
    // Unsubscribe from the server with the given ID
    setServers((prevServers) => {
      const newServers = { ...prevServers };
      delete newServers[server_id];
      return newServers;
    });
  };

  const handleSubscriptionData = async (subscriptionData: any) => {
    console.log('Subscription data:', subscriptionData);
    if (!subscriptionData) return;

    const { serversUpdated: serverData } = subscriptionData;
    const { type, server_id, data } = serverData;

    if (!serverData) return;

    // Handle the subscription data based on the event type
    // Please assign the type and payload to the following variables
    let dispatchLoad: {
      type: ServerActions | null;
      payload: any;
    }[] = [];

    const server = servers[server_id];

    // Please add the missing cases
    switch (type) {
      case ServerEvents.serverUpdated:
        {
          const newServers = [...props.serversList!];
          const index = newServers.findIndex(
            (server) => server.id === server_id
          );
          newServers[index] = {
            ...newServers[index],
            ...data
          };
          if (props.dispatch) {
            props.dispatch({
              type: 'SET_SERVERS',
              payload: newServers
            });
          }
        }
        break;
      case ServerEvents.serverDeleted:
        {
          // Remove the server from the list
          const newServers = props.serversList?.filter(
            (server) => server.id !== server_id
          );
          if (props.dispatch) {
            props.dispatch({
              type: 'SET_SERVERS',
              payload: newServers
            });
          }

          // Remove the server from the state
          const { [server_id]: _, ...newState } = servers;
          setServers(newState);
        }
        break;
      case ServerEvents.userStatusChanged:
        dispatchLoad.push({
          type: ServerActions.UPDATE_STATUS,
          payload: data
        });
        break;
      case ServerEvents.userProfileChanged:
        dispatchLoad.push({
          type: ServerActions.UPDATE_PROFILE,
          payload: data
        });
        break;
      case ServerEvents.memberJoined:
        {
          let profileAndStatus = await getServerProfile(data, true).catch(() =>
            getServerProfile(data)
          );

          dispatchLoad.push({
            type: ServerActions.SET_MEMBERS,
            payload: [...server.members, profileAndStatus]
          });
        }
        break;
      case ServerEvents.memberLeft:
        dispatchLoad.push({
          type: ServerActions.SET_MEMBERS,
          payload: server.members.filter(
            (member) => member.user_id !== data.user_id
          )
        });
        break;
      case ServerEvents.memberAdded:
        {
          const membersFetch = await getData(
            `/api/v1/servers/${server_id}/members`
          );

          const members: ServerProfile[] = membersFetch.map((member: any) => ({
            ...member,
            roles: member.roleIds
              .map((roleId: string) =>
                server.customRoles.find((role: Role) => role.id === roleId)
              )
              .filter((role: any) => role)
          }));

          dispatchLoad.push({
            type: ServerActions.SET_MEMBERS,
            payload: members
          });
        }
        break;
      case ServerEvents.memberRemoved:
        dispatchLoad.push({
          type: ServerActions.SET_MEMBERS,
          payload: server.members.filter(
            (member) => !data.includes(member.user_id)
          )
        });
        break;
      case ServerEvents.userRoleAdded:
        {
          // Increment the role count
          const newRoles = server.roles.map((role) =>
            role.id === data.role_id
              ? { ...role, number_of_users: role.number_of_users + 1 }
              : role
          );
          dispatchLoad.push({
            type: ServerActions.SET_ROLES,
            payload: newRoles
          });

          // Set the members with the updated roles
          const members = [...server.members];
          members.forEach((member) => {
            if (member.user_id === data.user_id) {
              member.roles.push(
                newRoles.find((role) => role.id === data.role_id)!
              );
            }
          });
          dispatchLoad.push({
            type: ServerActions.SET_MEMBERS,
            payload: members
          });
        }
        break;
      case ServerEvents.userRoleDeleted:
        {
          const members = [...server.members];
          members.forEach((member) => {
            if (member.user_id === data.user_id) {
              member.roles = member.roles.filter(
                (role) => role.id !== data.role_id
              );
            }
          });

          // Set the members with the updated roles
          dispatchLoad.push({
            type: ServerActions.SET_MEMBERS,
            payload: members
          });
          // Decrement the role count
          dispatchLoad.push({
            type: ServerActions.SET_ROLES,
            payload: server.roles.map((role) =>
              role.id === data.role_id
                ? { ...role, number_of_users: role.number_of_users - 1 }
                : role
            )
          });
        }
        break;
      case ServerEvents.emojiAdded:
        dispatchLoad.push({
          type: ServerActions.SET_EMOJI,
          payload: [
            ...server.emojis,
            {
              id: data._id,
              ...data
            }
          ]
        });
        break;
      case ServerEvents.emojiUpdated:
        dispatchLoad.push({
          type: ServerActions.SET_EMOJI,
          payload: server.emojis.map((emoji) =>
            emoji.id === data._id ? { ...emoji, ...data } : emoji
          )
        });

        break;
      case ServerEvents.emojiDeleted:
        dispatchLoad.push({
          type: ServerActions.SET_EMOJI,
          payload: server.emojis.filter((emoji) => emoji.id !== data._id)
        });
        break;
      case ServerEvents.roleAdded:
        dispatchLoad.push({
          type: ServerActions.SET_ROLES,
          payload: [
            ...server.roles,
            {
              id: data._id,
              number_of_users: 0,
              ...data
            }
          ]
        });
        break;
      case ServerEvents.roleUpdated:
        dispatchLoad.push({
          type: ServerActions.SET_ROLES,
          payload: server.roles.map((role) =>
            role.id === data._id ? { ...role, ...data } : role
          )
        });
        break;
      case ServerEvents.roleDeleted:
        dispatchLoad.push({
          type: ServerActions.SET_ROLES,
          payload: server.roles.filter((role) => role.id !== data._id)
        });

        // Remove the role from the members
        const members = [...server.members];
        members.forEach((member) => {
          member.roles = member.roles.filter((role) => role.id !== data._id);
        });
        dispatchLoad.push({
          type: ServerActions.SET_MEMBERS,
          payload: members
        });
        break;
      case ServerEvents.channelAdded:
        {
          conversationDispatch({
            type: ConversationsTypes.AddConversations,
            payload: {
              conversations: [
                {
                  id: data.conversation_id,
                  type: 'channel',
                  number_of_unread_mentions: 0,
                  has_new_message: false,
                  messages: []
                } as Conversation
              ]
            }
          });

          data.category_id = null;
          dispatchLoad.push({
            type: ServerActions.SET_CATEGORIES,
            payload: server.categories.map((category) =>
              category.id === data.category_id
                ? {
                    ...category,
                    channels: [
                      ...category.channels,
                      {
                        id: data._id,
                        ...data
                      }
                    ]
                  }
                : category
            )
          });
        }
        break;
      case ServerEvents.channelUpdated:
        {
          let newCategories = [...server.categories];
          const channel = data;

          if (Array.isArray(channel)) {
            channel.forEach((c) => {
              newCategories.forEach((category) => {
                category.channels = category.channels.map((ch) =>
                  ch.id === c._id ? c : ch
                );
              });
            });
          } else {
            newCategories.forEach((category) => {
              category.channels = category.channels.map((c) =>
                c.id === channel._id
                  ? {
                      ...c,
                      ...channel
                    }
                  : c
              );
            });
          }

          dispatchLoad.push({
            type: ServerActions.SET_CATEGORIES,
            payload: newCategories
          });
        }
        break;
      case ServerEvents.channelDeleted:
        {
          const categories = [...server.categories];
          const channel_id = data.channel_id;
          categories.forEach((category) => {
            category.channels = category.channels.filter(
              (c) => c.id !== channel_id
            );
          });
          dispatchLoad.push({
            type: ServerActions.SET_CATEGORIES,
            payload: categories
          });
        }
        break;
      case ServerEvents.categoryAdded:
        dispatchLoad.push({
          type: ServerActions.SET_CATEGORIES,
          payload: [
            ...server.categories,
            {
              id: data._id,
              ...data,
              channels: []
            }
          ]
        });
        break;
      case ServerEvents.categoryUpdated:
        {
          let categories = [...server.categories];
          const category = data;

          dispatchLoad.push({
            type: ServerActions.SET_CATEGORIES,
            payload: categories.map((c) =>
              c.id === category.id
                ? {
                    ...c,
                    ...category
                  }
                : c
            )
          });
        }
        break;
      case ServerEvents.categoryDeleted:
        {
          const categories = [...server.categories];
          const category_id = data.category_id;
          const channels = categories.find(
            (c) => c.id === category_id
          )?.channels;
          const newCategories = categories.filter((c) => c.id !== category_id);
          if (channels) {
            newCategories[0].channels.push(...channels);
          }

          dispatchLoad.push({
            type: ServerActions.SET_CATEGORIES,
            payload: newCategories
          });
        }
        break;
      case ServerEvents.messageAdded:
        conversationDispatch({
          type: ConversationsTypes.AddConversationMessage,
          payload: {
            conversationId: data.conversation_id,
            message: data.message
          }
        });
        if (data.conversation_id !== focusId) {
          // Mark the conversation as having a new message
          conversationDispatch({
            type: ConversationsTypes.PatchConversation,
            payload: {
              conversationId: data.conversation_id,
              patch: {
                has_new_message: true
              }
            }
          });
        }
        break;
      case ServerEvents.messageEdited:
        conversationDispatch({
          type: ConversationsTypes.SetConversationMessage,
          payload: {
            conversationId: data.conversation_id,
            message: data.message
          }
        });
        break;
      case ServerEvents.messageDeleted:
        conversationDispatch({
          type: ConversationsTypes.DeleteConversationMessage,
          payload: {
            conversationId: data.conversation_id,
            messageId: data.message_id
          }
        });
        break;
      case ServerEvents.messageMentionedUser:
        if (data.conversation_id !== focusId) {
          // Increment the number of unread mentions
          conversationDispatch({
            type: ConversationsTypes.IncrementUnreadMentions,
            payload: {
              conversationId: data.conversation_id,
              number: 1
            }
          });
        }
        break;
      case ServerEvents.messageMentionedRole:
        if (data.conversation_id !== focusId) {
          // Increment the number of unread mentions
          conversationDispatch({
            type: ConversationsTypes.IncrementUnreadMentions,
            payload: {
              conversationId: data.conversation_id,
              number: 1
            }
          });
        }
        break;
      case ServerEvents.messageReactionAdded:
        conversationDispatch({
          type: ConversationsTypes.SetMessageReaction,
          payload: {
            conversationId: data.conversation_id,
            messageId: data.message_id,
            reactions: data.reactions
          }
        });
        break;
      case ServerEvents.messageReactionRemoved:
        conversationDispatch({
          type: ConversationsTypes.SetMessageReaction,
          payload: {
            conversationId: data.conversation_id,
            messageId: data.message_id,
            reactions: data.reactions
          }
        });
        break;
      default:
        console.warn('Unknown event type:', type);
        console.log(type, server_id, data);
    }

    // Dispatch the action if the server is active
    if (activeServerIdRef.current === server_id) {
      dispatchLoad.forEach((load) => {
        dispatch({
          type: load.type || ServerActions.INIT,
          payload: load.payload
        });
      });
    }

    // Update the other servers data using the reducer
    dispatchLoad.forEach((load) => {
      setServers((prevServers) => ({
        ...prevServers,
        [server_id]: reducer(prevServers[server_id], {
          type: load.type || ServerActions.INIT,
          payload: load.payload
        })
      }));
    });
  };

  useEffect(() => {
    if (subscriptionData) {
      handleSubscriptionData(subscriptionData);
    }
  }, [subscriptionData, dispatch]);

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

  // Fetch server data
  const fetchServerData = async (server_id: string) => {
    if (servers[server_id]) return servers[server_id];

    try {
      // Using Promise.all to fetch all the data at once
      const [
        channelsFetch,
        categoriesFetch,
        membersFetch,
        roles,
        emojis,
        permissionsFetched
      ] = await Promise.all([
        getData(`/api/v1/servers/${server_id}/channels`)
          .then((res) => res?.channels || [])
          .catch((err) => []),
        getData(`/api/v1/servers/${server_id}/categories`)
          .then((res) => res?.categories || [])
          .catch((err) => []),
        getData(`/api/v1/servers/${server_id}/members`).catch((err) => []),
        getData(`/api/v1/servers/${server_id}/roles`)
          .then((res) => res?.roles || [])
          .catch((err) => []),
        getData(`/api/v1/servers/${server_id}/emojis`).then((res) => res || []),
        getData(`/api/v1/servers/${server_id}/members/self/permissions`)
          .then((res) => res || {})
          .catch((err) => [])
      ]).catch((err) => {
        throw new Error(err.message);
      });

      const categories: Category[] = categoriesFetch.map(
        (category: any, index: number) => {
          return {
            id: category.id,
            name: category.name,
            channels: channelsFetch?.filter(
              (channel: any) => channel.category_id === category.id
            ),
            position: index + 1
          };
        }
      );

      // Add a separate category for uncategorized channels
      categories.unshift({
        id: null,
        name: 'Uncategorized',
        channels: channelsFetch?.filter((channel: any) => !channel.category_id),
        position: 0
      });

      // Initialize conversations
      conversationDispatch({
        type: ConversationsTypes.AddConversations,
        payload: {
          conversations: channelsFetch.map(
            (channel: any) =>
              ({
                id: channel.conversation_id,
                type: 'channel',
                number_of_unread_mentions: channel.number_of_unread_mentions,
                has_new_message: channel.has_new_message,
                messages: []
              } as Conversation)
          )
        }
      });

      channelsFetch.forEach((channel: any) => {
        if (channel.last_message)
          conversationDispatch({
            type: ConversationsTypes.AddConversationMessage,
            payload: {
              conversationId: channel.conversation_id,
              message: channel.last_message
            }
          });
      });

      let defaultRole: Role | null = null;
      const customRoles: Role[] = [];
      roles.forEach((role: Role) => {
        if (role.default) {
          defaultRole = role;
        } else {
          customRoles.push(role);
        }
      });

      const members: ServerProfile[] = membersFetch.map((member: any) => ({
        ...member,
        roles: member.roleIds
          .map((roleId: string) =>
            customRoles.find((role: Role) => role.id === roleId)
          )
          .filter((role: any) => role)
      }));

      const permissions = responseToPermissions(permissionsFetched);
      const isAdmin = permissionsFetched.is_admin;

      const updatedServer = {
        latestAction: ServerActions.INIT,
        server_id: server_id,
        categories: categories,
        members: members,
        roles: roles,
        defaultRole: defaultRole,
        customRoles: customRoles,
        emojis: emojis,
        permissions: permissions,
        isAdmin: isAdmin
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
        dispatch,
        unsubscribeServer
      }}
    >
      {props.children}
    </ServerContext.Provider>
  );
};
