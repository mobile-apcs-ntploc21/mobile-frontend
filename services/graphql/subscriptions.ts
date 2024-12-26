import { gql } from '@apollo/client';

export const USER_STATUS_SUBSCRIPTION = gql`
  subscription OnUserStatusChange($user_id: ID!) {
    userStatusChanged(user_id: $user_id) {
      user_id
      type
      status_text
      last_seen
      is_online
    }
  }
`;

export const USER_PROFILE_SUBSCRIPTION = gql`
  subscription OnUserProfileUpdated($user_id: ID!, $server_id: ID) {
    userProfileUpdated(user_id: $user_id, server_id: $server_id) {
      user_id
      server_id
      display_name
      username
      about_me
      avatar_url
      banner_url
    }
  }
`;

export const SERVER_SUBSCRIPTION = gql`
  subscription OnServerUpdated($server_id: ID!, $user_id: ID) {
    serverUpdated(server_id: $server_id, user_id: $user_id) {
      server_id
      type
      data
    }
  }
`;

export const SERVERS_SUBSCRIPTION = gql`
  subscription OnServersUpdated($server_ids: [ID!]!, $user_id: ID) {
    serversUpdated(server_ids: $server_ids, user_id: $user_id) {
      server_id
      type
      data
    }
  }
`;

export const DUMMY_SUBSCRIPTION = gql`
  subscription OnDummy($user_id: ID) {
    _(user_id: $user_id) {
      type
      data
    }
  }
`;

export const DIRECT_MESSAGE_SUBSCRIPTION = gql`
  subscription OnDirectMessageUpdated($conversation_id: ID!) {
    directMessageUpdated(conversation_id: $conversation_id) {
      conversation_id
      type
      data
    }
  }
`;
