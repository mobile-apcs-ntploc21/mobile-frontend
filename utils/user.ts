import { colors } from '@/constants/theme';
import { ServerProfile } from '@/types';
import { StatusType } from '@/types/user_status';

export const getOnlineStatusColor = (status?: StatusType) => {
  switch (status) {
    case StatusType.ONLINE:
      return colors.status_online;
    case StatusType.IDLE:
      return colors.status_idle;
    case StatusType.DO_NOT_DISTURB:
      return colors.status_dnd;
    default:
      return colors.status_offline;
  }
};

export const isAdmin = (profile: ServerProfile) => {
  return profile.roles.some((role) => role.is_admin);
};
