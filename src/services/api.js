// src/services/api.js
const BASE_URL = 'http://localhost/forsa-platform-backend/api';

const getToken = () => localStorage.getItem('forsa_token');

const buildHeaders = (withAuth = true) => {
  const headers = { 'Content-Type': 'application/json' };
  if (withAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const request = async (method, endpoint, body = null, withAuth = true) => {
  const options = {
    method,
    headers: buildHeaders(withAuth),
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || 'Something went wrong');
  }

  return json.data ?? json;
};

const uploadFile = async (endpoint, formData) => {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || 'Upload failed');
  return json.data ?? json;
};

export { request, uploadFile, BASE_URL };
