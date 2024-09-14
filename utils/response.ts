export const responseToPermissions = (response: any) => {
  return Object.entries(response.permissions).reduce((acc, [key, value]) => {
    acc[key] = response.is_admin || value === 'ALLOWED';
    return acc;
  }, {} as Record<string, boolean>);
};
