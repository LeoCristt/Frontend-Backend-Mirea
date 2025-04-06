const API_URL = 'http://localhost:3000';

export async function register(email: string, password: string) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}

export async function getProfile() {
  const response = await fetch(`${API_URL}/profile`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}

export async function getData() {
  const response = await fetch(`${API_URL}/data`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}