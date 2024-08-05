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
