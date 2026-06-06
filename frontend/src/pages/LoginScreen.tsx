import { useState } from 'react'

import type { LoginCredentials } from '../types'

type LoginScreenProps = {
    onLogin: (credentials: LoginCredentials) => Promise<void>
    error: string | null
}

function LoginScreen({ onLogin, error }: LoginScreenProps) {
    const [username, setUsername] = useState('sathosh@onlinematch.com')
    const [password, setPassword] = useState('match123')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSubmitting(true)

        try {
            await onLogin({ username, password })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-100 via-white to-amber-50/20 text-slate-800">
            <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-stretch gap-6 lg:grid-cols-[1.3fr_0.9fr]">
                <section className="hidden md:flex relative overflow-hidden rounded-[2rem] p-8 lg:p-12 border border-slate-200/80 bg-white/70 shadow-xl backdrop-blur-md">
                    <div className="absolute -left-10 top-10 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl" />
                    <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-rose-500/10 blur-3xl" />

                    <div className="relative z-10 flex h-full flex-col justify-between gap-10">
                        <div>
                            <div className="inline-flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs uppercase tracking-[0.35em] text-amber-800 font-semibold shadow-sm">
                                Matchmaker MVP
                            </div>
                            <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-slate-800 sm:text-5xl lg:text-6xl leading-tight">
                                An internal matchmaking cockpit for verified profiles, notes, and AI-ranked intros.
                            </h1>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200/60 bg-white/50 p-4 shadow-sm backdrop-blur-sm hover:border-amber-300 transition-colors">
                                <div className="text-2xl font-bold text-slate-800">100+</div>
                                <div className="mt-1 text-sm text-slate-600 font-medium">opposite-gender profiles</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200/60 bg-white/50 p-4 shadow-sm backdrop-blur-sm hover:border-amber-300 transition-colors">
                                <div className="text-2xl font-bold text-slate-800">Indian</div>
                                <div className="mt-1 text-sm text-slate-600 font-medium">community, religion, family-fit fields</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200/60 bg-white/50 p-4 shadow-sm backdrop-blur-sm hover:border-amber-300 transition-colors">
                                <div className="text-2xl font-bold text-slate-800">AI ranked</div>
                                <div className="mt-1 text-sm text-slate-600 font-medium">scores with human-readable reasons</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex justify-center items-center rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 bg-white/70 shadow-xl backdrop-blur-md">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <div className="text-sm uppercase tracking-[0.35em] text-amber-600 font-semibold">Matchmaker Login</div>
                            <h2 className="mt-3 text-3xl font-semibold text-slate-800">Sign in to the dashboard</h2>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-600">Username</span>
                                <input
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500"
                                    placeholder="matchmaker@datecrew.com"
                                    autoComplete="username"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-600">Password</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500"
                                    placeholder="match123"
                                    autoComplete="current-password"
                                />
                            </label>

                            {error ? (
                                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 font-medium">
                                    {error}
                                </div>
                            ) : null}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="gold-accent inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 shadow-md"
                            >
                                {submitting ? 'Signing in...' : 'Enter Dashboard'}
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default LoginScreen
