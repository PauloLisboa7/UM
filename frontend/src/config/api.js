/**
 * API Configuration
 * Uses Vite proxy in development, absolute URL in production
 */
export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    // Handle response safely
    const text = await response.text();
    let body = {};
    
    try {
      body = text ? JSON.parse(text) : {};
    } catch (parseErr) {
      body = { __raw: text };
    }

    if (!response.ok) {
      const error = new Error(body.message || body.__raw || 'API Error');
      error.status = response.status;
      error.data = body;
      throw error;
    }

    return body;
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
};
