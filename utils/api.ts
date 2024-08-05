import { getIdToken } from '@/services/auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://fbi.com:4001';

/**
 * To send a POST request to the server.
 *
 * @async
 * @param {string} url - The URL to send the request.
 * @param {*} data - The data to send to the server.
 * @param {{}} [addHeaders={}] - Additional headers to send to the server.
 * @returns {Promise<any>} - The response from the server.
 */
export const postData = async (
  url: string,
  data: {} = {},
  addHeaders: {} = {}
): Promise<any> => {
  const headers: any = {
    'Content-Type': 'application/json',
    ...addHeaders
  };
  const idToken = await getIdToken();
  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  }

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
export const getData = async (
  url: string,
  addHeaders: {} = {}
): Promise<any> => {
  const headers: any = {
    'Content-Type': 'application/json',
    ...addHeaders
  };
  const idToken = await getIdToken();
  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  }

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
 * To send a DELETE request to the server.
 *
 * @async
 * @param {string} url - The URL to send the request.
 * @param {*} data - The data to send to the server.
 * @param {{}} [addHeaders={}] - Additional headers to send to the server.
 * @returns {Promise<any>} - The response from the server.
 */
export const deleteData = async (
  url: string,
  data: {} = {},
  addHeaders: {} = {}
): Promise<any> => {
  const headers: any = {
    'Content-Type': 'application/json',
    ...addHeaders
  };
  const idToken = await getIdToken();
  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  }

  try {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
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
 * To send a PATCH request to the server.
 *
 * @async
 * @param {string} url - The URL to send the request.
 * @param {*} data - The data to send to the server.
 * @param {{}} [addHeaders={}] - Additional headers to send to the server.
 * @returns {Promise<any>} - The response from the server.
 */
export const patchData = async (
  url: string,
  data: {} = {},
  addHeaders: {} = {}
): Promise<any> => {
  const headers: any = {
    'Content-Type': 'application/json',
    ...addHeaders
  };
  const idToken = await getIdToken();
  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  }

  try {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'PATCH',
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
