import { useEffect, useMemo, useState } from 'react'

import Dashboard from './pages/Dashboard'
import LoginScreen from './pages/LoginScreen'
import { apiLogin, apiRequest } from './lib/api'
import type {
  AuthUser,
  CustomerDetail,
  CustomerSummary,
  DashboardData,
  LoginCredentials,
  MatchProfile,
  SendMatchResult,
} from './types'

const TOKEN_KEY = 'datecrew_token'
const USER_KEY = 'datecrew_user'

function App() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [customers, setCustomers] = useState<CustomerSummary[]>([])
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null)
  const [matchPool, setMatchPool] = useState<MatchProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_KEY)
    const storedUser = window.localStorage.getItem(USER_KEY)

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser) as AuthUser)
      void bootstrap(storedToken)
      return
    }

    setLoading(false)
  }, [])

  const selectedSummary = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId) || null,
    [customers, selectedCustomerId],
  )

  async function refreshOverview(authToken: string) {
    const [dashboardResponse, customersResponse] = await Promise.all([
      apiRequest<DashboardData>('/api/dashboard', { token: authToken }),
      apiRequest<CustomerSummary[]>('/api/customers', { token: authToken }),
    ])

    setDashboard(dashboardResponse)
    setCustomers(customersResponse)

    return customersResponse
  }

  async function bootstrap(authToken: string) {
    setLoading(true)
    setError(null)

    try {
      const customersResponse = await refreshOverview(authToken)
      const nextSelectedId = selectedCustomerId || customersResponse[0]?.id || null

      if (nextSelectedId) {
        setSelectedCustomerId(nextSelectedId)
        await loadCustomer(nextSelectedId, authToken)
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load dashboard.')
      clearSession()
    } finally {
      setLoading(false)
    }
  }

  async function loadCustomer(customerId: string, authToken = token) {
    if (!authToken) {
      return
    }

    setActionLoading(true)
    try {
      const response = await apiRequest<{ customer: CustomerDetail; matches: MatchProfile[] }>(
        `/api/customers/${customerId}`,
        { token: authToken },
      )

      setSelectedCustomer(response.customer)
      setMatchPool(response.matches)
      setSelectedCustomerId(customerId)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load customer details.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleLogin(credentials: LoginCredentials) {
    setError(null)
    const response = await apiLogin(credentials)
    window.localStorage.setItem(TOKEN_KEY, response.token)
    window.localStorage.setItem(USER_KEY, JSON.stringify(response.user))
    setToken(response.token)
    setUser(response.user)
    await bootstrap(response.token)
  }

  function clearSession() {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
    setCustomers([])
    setDashboard(null)
    setSelectedCustomerId(null)
    setSelectedCustomer(null)
    setMatchPool([])
  }

  async function handleAddNote(note: string) {
    if (!selectedCustomerId || !token) {
      return
    }

    await apiRequest(`/api/customers/${selectedCustomerId}/notes`, {
      method: 'POST',
      token,
      body: { note },
    })

    await refreshOverview(token)
    await loadCustomer(selectedCustomerId, token)
  }

  async function handleSendMatch(profileId: string) {
    if (!selectedCustomerId || !token) {
      throw new Error('Select a customer first.')
    }

    const response = await apiRequest<SendMatchResult>(
      `/api/customers/${selectedCustomerId}/matches/${profileId}/send`,
      {
        method: 'POST',
        token,
      },
    )

    await refreshOverview(token)
    await loadCustomer(selectedCustomerId, token)
    return response
  }

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="glass-panel rounded-3xl px-8 py-6 text-sm text-slate-300 shadow-2xl">
          Loading DateCrew dashboard...
        </div>
      </div>
    )
  }

  if (!user || !token) {
    return <LoginScreen onLogin={handleLogin} error={error} />
  }

  return (
    <Dashboard
      user={user}
      customers={customers}
      dashboard={dashboard}
      selectedCustomerId={selectedCustomerId}
      selectedCustomer={selectedCustomer}
      selectedSummary={selectedSummary}
      matchPool={matchPool}
      loading={loading}
      actionLoading={actionLoading}
      error={error}
      onLogout={clearSession}
      onSelectCustomer={loadCustomer}
      onAddNote={handleAddNote}
      onSendMatch={handleSendMatch}
    />
  )
}

export default App
