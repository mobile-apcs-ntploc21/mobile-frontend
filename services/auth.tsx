import { env } from '../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  [key: string]: any;
}

let user: User | null = null;

// To post data to the server.
const postData = async (url: string, data: any, addHeaders = {}): Promise<any> => {
  const headers = {
    'Content-Type': 'application/json',
    ...addHeaders
  };

  const response = await fetch(`${env.GQL_SERVER}${url}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data || {})
  });

  if (!response.ok) {
    const e = await response.json();
    throw new Error(e.message);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return;
};

// To get the date in seconds.
export const now = () => Math.floor(Date.now() / 1000);

// To get user's ID token from the server.
// param: forceRefresh - If true, the server will force to get a new ID token.
export async function getIDToken(forceRefresh: boolean = false): Promise<string | null> {
  let currentIdToken = await AsyncStorage.getItem('idToken');
  const expires = await AsyncStorage.getItem('expires');

  if (!currentIdToken) {
    return null;
  }

  if ((expires && parseInt(expires) < now()) || forceRefresh) {
    try {
      const {
        idToken,
        refreshToken,
        expires,
        uid: id
      } = await postData('/auth/refresh', {
        refreshToken: await AsyncStorage.getItem('refreshToken'),
      });

      currentIdToken = idToken;
      await AsyncStorage.setItem('idToken', idToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('expires', String(now() + expires));
      await AsyncStorage.setItem('uid', id);
    } catch (e) {
      await AsyncStorage.clear();
      return null;
    }
  }

  return currentIdToken;
}

// To get the user's data from the server.
export async function getUser(forceRefresh: boolean = false): Promise<User | null> {
  const idToken = await getIDToken(forceRefresh);
  if (!idToken) {
    return null;
  }
  const decoded: { user : User } = jwtDecode(idToken);

  return decoded.user;
}

export async function updateUser(uid: string, data: any): Promise<boolean> {
  const idToken = await getIDToken();
  if (!idToken) {
    throw new Error('Not authenticated');
  }
  await postData(`/auth/update/${uid}`, data, {
    Authorization: `Bearer ${await getIDToken()}`,
  });
  return true;
}

export async function login(email: string, password: string): Promise<User | null> {
  const { idToken, refreshToken, expires, uid: id } = await postData('/auth/login', {
    email,
    password
  });

  await AsyncStorage.setItem('idToken', idToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);
  await AsyncStorage.setItem('expires', String(now() + expires));
  await AsyncStorage.setItem('uid', id);
  user = await getUser();

  return user;
}

export async function logout(): Promise<boolean> {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (!refreshToken) {
    await AsyncStorage.clear();
    return true;
  }

  await postData(
    '/auth/logout',
    {
      refreshToken: await AsyncStorage.getItem('refreshToken')
    },
    {
      Authorization: `Bearer ${await getIDToken()}`
    }
  );

  await AsyncStorage.clear();
  user = null;
  return true;
}

export async function createUser(email: string, password: string): Promise<User | null> {
  const { idToken, refreshToken, expires, uid: id } = await postData('/auth/users', {
    email,
    password
  });

  await AsyncStorage.setItem('idToken', idToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);
  await AsyncStorage.setItem('expires', String(now() + expires));
  await AsyncStorage.setItem('uid', id);
  user = await getUser();

  return user;
}