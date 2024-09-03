import { Role } from '@/context/ServerProvider';

export const responseToRoles = (response: any): Role[] => {
  if (!response.roles) return [];
  return response.roles
    .filter((role: any) => role.default === false)
    .map((role: any) => ({
      id: role.id,
      name: role.name,
      color: role.color,
      allowMention: role.allow_anyone_mention,
      memberCount: role.number_of_users
    }));
};
