import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import config from '@/utils/config';

const API_URL = config.API_URL;
const now = () => Math.floor(Date.now() / 1000);

/**
 * To send a POST request to the server.
 *
 * @async
 * @param {string} url - The URL to send the request.
 * @param {*} data - The data to send to the server.
 * @param {{}} [addHeaders={}] - Additional headers to send to the server.
 * @returns {Promise<any>} - The response from the server.
 */
const postData = async (
  url: string,
  data: any,
  addHeaders: {} = {}
): Promise<any> => {
  const headers = {
    'Content-Type': 'application/json',
    ...addHeaders
  };

  console.log('postData', `${API_URL}${url}`, headers, data);

  try {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data || {})
    });

    if (!response.ok) {
      const e = await response.json();
      throw new Error(e.message);
    }

    return await response.json();
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message);
  }
};

/**
 * To send a GET request to the server.
 *
 * @async
 * @param {string} url - The URL to send the request.
 * @param {{}} [addHeaders={}] - Additional headers to send to the server.
 * @returns {Promise<any>} - The response from the server.
 */
const getData = async (url: string, addHeaders: {} = {}): Promise<any> => {
  const headers = {
    'Content-Type': 'application/json',
    ...addHeaders
  };

  try {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      const e = await response.json();
      throw new Error(e.message);
    }

    return await response.json();
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message);
  }
};

/**
 * To get the ID token from AsyncStorage or from server if expired or forceRefreshed.
 *
 * @export
 * @async
 * @param {boolean} [forceRefresh=false] - If true, the server will force to get a new JWT Token.
 * @returns {Promise<string | null>} - JWT Token if valid, else null
 */
export async function getIdToken(
  forceRefresh: boolean = false
): Promise<string | null> {
  const currentIdToken = await AsyncStorage.getItem('idToken');

  if (!currentIdToken || currentIdToken == '') {
    return null;
  }

  const decoded = jwtDecode(currentIdToken);
  const { exp } = decoded;

  // If the token is expired or forceRefresh is true, get a new token.
  if ((exp && exp < now()) || forceRefresh) {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        return null;
      }

      const response = await postData('/api/v1/users/refresh', {
        refreshToken
      });

      await AsyncStorage.setItem('idToken', response['jwtToken']);
      await AsyncStorage.setItem('refreshToken', response['refreshToken']);

      return response['jwtToken'];
    } catch (err: any) {
      await AsyncStorage.clear();
      throw new Error(err.message);
    }
  }

  return currentIdToken;
}

/**
 * To get user's data from the server.
 * @param forceRefresh - If true, the server will force to get a new JWT Token.
 * @returns User information if valid, else null
 */
export async function getUser(forceRefresh: boolean = false): Promise<any> {
  const currentIdToken = await getIdToken(forceRefresh);
  if (currentIdToken == null || currentIdToken == '') {
    return null;
  }

  // Get user information from the server.
  const response = await getData('/api/v1/users/me', {
    Authorization: `Bearer ${currentIdToken}`
  }).catch(() => null);

  // If the response is null, clear the AsyncStorage.
  if (!response || response == null) {
    await AsyncStorage.clear();
    return null;
  }

  return response;
}

/**
 * This function is to login user to the server, and save the ID token to AsyncStorage.
 *
 * @export
 * @async
 * @param {string} email      - User's email
 * @param {string} password   - User's password
 * @returns {Promise<any>}    - User information if success, else throw an error
 */
export async function login(email: string, password: string): Promise<any> {
  try {
    const response = await postData('/api/v1/users/login', { email, password });

    if (!response) {
      throw new Error('Failed to login User.');
    }

    // Save the ID token to AsyncStorage.
    await AsyncStorage.setItem('uid', response.id);
    await AsyncStorage.setItem('idToken', response.jwtToken);
    await AsyncStorage.setItem('refreshToken', response.refreshToken);

    return response;
  } catch (e: any) {
    // Clear any AsyncStorage data.
    await AsyncStorage.clear();
    throw new Error(e.message);
  }
}

/**
 * This function is to register user to the server, and save the ID token to AsyncStorage.
 * @param username  - User's name
 * @param phone     - User's phone number
 * @param email     - User's email
 * @param password  - User's password
 * @returns User information if success, else null
 */
export async function register(
  username: string,
  phone: string,
  email: string,
  password: string
): Promise<any> {
  try {
    const response = await postData('/api/v1/users/register', {
      username,
      phone,
      email,
      password
    });

    if (!response) {
      throw new Error('Failed to register user');
    }

    await AsyncStorage.setItem('uid', response['id']);
    await AsyncStorage.setItem('idToken', response['jwtToken']);
    await AsyncStorage.setItem('refreshToken', response['refreshToken']);

    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function logout(): Promise<void> {
  // TODO: Call the server to logout the user.
  await AsyncStorage.clear();
}
