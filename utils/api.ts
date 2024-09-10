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
  addHeaders: {} = {},
  params: {} = {}
): Promise<any> => {
  const headers: any = {
    'Content-Type': 'application/json',
    ...addHeaders
  };
  const idToken = await getIdToken();
  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  }

  const queryString = new URLSearchParams(params).toString();
  const URL = queryString
    ? `${API_URL}${url}?${queryString}`
    : `${API_URL}${url}`;

  try {
    const response = await fetch(URL, {
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

/**
 * To send a GET request to the server.
 *
 * @async
 * @param {string} url - The URL to send the request.
 * @param {{}} [addHeaders={}] - Additional headers to send to the server.
 * @param {{}} [params={}] - The query parameters to send to the server.
 * @returns {Promise<any>} - The response from the server.
 */
export const getData = async (
  url: string,
  addHeaders: {} = {},
  params: {} = {}
): Promise<any> => {
  const headers: any = {
    'Content-Type': 'application/json',
    ...addHeaders
  };
  const idToken = await getIdToken();
  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  }

  const queryString = new URLSearchParams(params).toString();
  const URL = queryString
    ? `${API_URL}${url}?${queryString}`
    : `${API_URL}${url}`;

  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      const e = await response.json();
      throw new Error(e.message);
    }

    return await response.json();
  } catch (err: any) {
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

    if (response.status === 204) {
      return {};
    }

    return await response.json();
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message);
  }
};

/**
 * To send a PUT request to the server.
 *
 * @async
 * @param {string} url - The URL to send the request.
 * @param {*} data - The data to send to the server.
 * @param {{}} [addHeaders={}] - Additional headers to send to the server.
 * @returns {Promise<any>} - The response from the server.
 */
export const putData = async (
  url: string,
  data: {} = {},
  addHeaders: {} = {},
  receiveData: boolean = true
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
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data || {})
    });

    if (!response.ok) {
      const e = await response.json();
      throw new Error(e.message);
    }

    if (receiveData) return await response.json();

    return null;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message);
  }
};
