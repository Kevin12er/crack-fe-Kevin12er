const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://crack-be-kevin12er-production.up.railway.app';

export async function fetchApi(endpoint, options = {}) {
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

  const data = await response.json().catch(() => null);

  // Jika 401 Unauthorized, hapus token tanpa me-reload halaman secara paksa
  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('token');
    const errorMessage = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message || 'Sesi telah berakhir, silakan login kembali.';
    throw new Error(errorMessage);
  }

  // Handle error HTTP lainnya dari NestJS
  if (!response.ok) {
    const errorMessage = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message || 'Terjadi kesalahan pada server';
    throw new Error(errorMessage);
  }

  return data;
}

export async function getCourses(filters = {}) {
  const queryParams = new URLSearchParams();

  if (filters.search) queryParams.append("search", filters.search);
  if (filters.category) queryParams.append("category", filters.category);
  if (filters.minPrice !== undefined && filters.minPrice !== "") {
    queryParams.append("minPrice", filters.minPrice);
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== "") {
    queryParams.append("maxPrice", filters.maxPrice);
  }

  const queryString = queryParams.toString();
  return fetchApi(`/courses${queryString ? `?${queryString}` : ""}`);
}