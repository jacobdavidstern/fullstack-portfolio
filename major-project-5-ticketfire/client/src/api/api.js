import { DEMO_MODE } from '../demo';
const API_BASE = 'http://localhost:3001/api';

export const apiFetch = async (endpoint, options = {}) => {
  const isGet = !options.method || options.method === 'GET';

  // DEMO_MODE client preload
  if (DEMO_MODE && isGet && endpoint === '/summit') {
    return {
      slug: 'summit',
      name: 'Summit School District',
    };
  }

  // DEMO_MODE intercept
  if (DEMO_MODE && isGet) {
    const clean = endpoint.replace(/^\//, '');
    return fetch(`/demo/${clean}.json`).then((r) => r.json());
  }

  // Real API call
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'API error');
  }

  return data;
};
