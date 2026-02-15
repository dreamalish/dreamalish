import APIURL from './Environment';

export const authFetch = (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    return fetch(`${APIURL}${endpoint}`, {
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    }).then(async res => {
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    });
};
