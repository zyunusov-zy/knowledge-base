// Get access token
export const getAccessToken = () => {
  return sessionStorage.getItem('accessToken');
};

// Get refresh token
export const getRefreshToken = () => {
  return sessionStorage.getItem('refreshToken');
};

// Remove tokens (logout)
export const clearTokens = () => {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAccessToken();
};

// Refresh the access token
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    
    if (response.ok && data.accessToken) {
      sessionStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    }
    
    throw new Error('Failed to refresh token');
  } catch (error) {
    clearTokens();
    window.location.href = '/login';
    throw error;
  }
};