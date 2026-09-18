const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://crack-be-kevin12er-production.up.railway.app';

export async function fetchApi(endpoint, options = {}) {
  // 1. Ambil token dari localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 2. Handle HTTP 401 (Unauthorized)
  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Sesi telah berakhir, silakan login kembali.');
  }

  const data = await response.json().catch(() => null);

  // 3. Handle error response dari NestJS (termasuk array message)
  if (!response.ok) {
    const errorMessage = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message || 'Terjadi kesalahan pada server';
    throw new Error(errorMessage);
  }

  return data;
}