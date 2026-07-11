/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();
  const headers = new Headers(options.headers || {});

  if (session && (session as any).accessToken) {
    headers.set('Authorization', `Bearer ${(session as any).accessToken}`);
  }

  // Set Content-Type unless we're sending FormData
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}
