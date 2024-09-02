import { StatusType } from '@/types/user_status';

export default function getStatusText(onlineStatus: StatusType): string {
  switch (onlineStatus) {
    case StatusType.ONLINE:
      return 'Online';
    case StatusType.IDLE:
      return 'Idle';
    case StatusType.DO_NOT_DISTURB:
      return 'Do Not Disturb';
    default:
      // Should not happen
      return 'Offline';
  }
}
