const BASE_URL = 'http://localhost:8000';

const BASE_URL = 'http://localhost:8000';

async function api(path, options = {}) {
  // Build and send the initial request
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
      ...options.headers,
    },
  });

  // If the server accepted the request, we are done
  if (response.status !== 401) {
    return response;
  }

  // Access token has expired — attempt a silent refresh
  const refresh = localStorage.getItem('refresh');

  if (!refresh) {
    // No refresh token stored — the user has never logged in or already logged out
    window.location.href = '/login';
    return;
  }

  const refreshResponse = await fetch(`${BASE_URL}/api/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!refreshResponse.ok) {
    // Refresh token itself has expired — the user must log in again
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
    return;
  }

  const tokens = await refreshResponse.json();
  localStorage.setItem('access', tokens.access);

  // DRF's ROTATE_REFRESH_TOKENS is enabled, so a new refresh token is also issued
  if (tokens.refresh) {
    localStorage.setItem('refresh', tokens.refresh);
  }

  // Retry the original request with the new access token
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokens.access}`,
      ...options.headers,
    },
  });
}

export default api;
