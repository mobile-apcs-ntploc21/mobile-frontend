import { postData } from './api';

export const getPresignedPostServer = async (
  serverId: string,
  channelId: string,
  filename: string,
  fileType?: string,
  fileSize?: number
): Promise<{
  uploadUrl: string;
  fields: { [key: string]: string };
  key: string;
}> => {
  const response = await postData(
    `/api/v1/servers/${serverId}/channels/${channelId}/messages/upload`,
    {
      filename,
      fileType,
      fileSize
    }
  );
  return response;
};
