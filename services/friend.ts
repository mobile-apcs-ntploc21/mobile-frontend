import { deleteData, getData, postData } from '@/utils/api';

// Friend Management------------------------------------------------------------

export async function addFriend(friendId: string): Promise<any> {
  try {
    const response = await postData(`/api/v1/friends/${friendId}`);

    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function searchByUsername(username: string): Promise<any> {
  try {
    const response = await getData(`/api/v1/profile/u/${username}`);

    return response;
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function deleteFriend(friendId: string): Promise<any> {
  try {
    const response = await deleteData(`/api/v1/friends/${friendId}`);

    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function acceptFriendRequest(friendId: string): Promise<any> {
  try {
    const response = await postData(`/api/v1/friends/accept/${friendId}`);

    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function declineFriendRequest(friendId: string): Promise<any> {
  try {
    const response = await deleteData(
      `/api/v1/friends/cancel/received/${friendId}`
    );

    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function cancelFriendRequest(friendId: string): Promise<any> {
  try {
    const response = await deleteData(
      `/api/v1/friends/cancel/sent/${friendId}`
    );

    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// Block/Unblock----------------------------------------------------------------

export async function blockUser(userId: string): Promise<any> {
  try {
    const response = await postData(`/api/v1/block/${userId}`);

    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function unblockUser(userId: string): Promise<any> {
  try {
    const response = await deleteData(`/api/v1/block/${userId}`);

    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// Listing and Querying--------------------------------------------------------

export async function getFriends(): Promise<any> {
  try {
    const response = await getData('/api/v1/friends');

    return response.friends;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getFriendRequestsReceived(): Promise<any> {
  try {
    const response = await getData('/api/v1/friends/requests/received');

    return response.requests;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getFriendRequestsSent(): Promise<any> {
  try {
    const response = await getData('/api/v1/friends/requests/sent');

    return response.requests;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getBlockedUsers(): Promise<any> {
  try {
    const response = await getData('/api/v1/block');

    return response.blocked;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getUserRelationship(userId: string): Promise<any> {
  try {
    const response = await getData(`/api/v1/relationship/${userId}`);

    return response.type;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
