import { colors } from '@/constants/theme';

export const getOnlineStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return colors.status_online;
    case 'invisible':
      return colors.status_offline;
    case 'idle':
      return colors.status_idle;
    case 'do_not_disturb':
      return colors.status_dnd;
    default:
      return colors.status_offline;
  }
};
