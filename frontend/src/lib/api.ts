import type { LoginCredentials, AuthUser } from '../types'

const API_BASE = import.meta.env.VITE_API_URL || ''

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  token?: string | null
  body?: unknown
}

async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>

  if (!response.ok) {
    throw new Error((data.message as string) || 'Request failed.')
  }

  return data as T
}

async function apiLogin(credentials: LoginCredentials): Promise<{ token: string; user: AuthUser }> {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: credentials,
  }) as Promise<{ token: string; user: AuthUser }>
}

export { apiLogin, apiRequest }