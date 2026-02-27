import APIURL from './Environment';

export const authFetch = (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  // Build headers safely using HeadersInit type
  const headers: HeadersInit = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}), // merge any headers passed in
  };

  return fetch(`${APIURL}${endpoint}`, {
    ...options,
    headers, // safe for all fetch types
    credentials: 'include', // needed for cookies / JWT preflight
  }).then(async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  });
};
