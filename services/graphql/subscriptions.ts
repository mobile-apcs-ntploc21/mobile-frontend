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
