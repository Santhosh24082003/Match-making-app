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
        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-stretch gap-6 lg:grid-cols-[1.3fr_0.9fr]">
                <section className="hidden md:flex glass-panel relative overflow-hidden rounded-[2rem] p-8 lg:p-12">
                    <div className="absolute -left-10 top-10 h-44 w-44 rounded-full bg-amber-500/20 blur-3xl" />
                    <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-rose-500/20 blur-3xl" />

                    <div className="relative z-10 flex h-full flex-col justify-between gap-10">
                        <div>
                            <div className="inline-flex items-center gap-3 rounded-full border border-amber-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-amber-100/80">
                                Matchmaker MVP
                            </div>
                            <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                                An internal matchmaking cockpit for verified profiles, notes, and AI-ranked intros.
                            </h1>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="text-2xl font-semibold text-white">100+</div>
                                <div className="mt-1 text-sm text-slate-400">opposite-gender profiles</div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="text-2xl font-semibold text-white">Indian</div>
                                <div className="mt-1 text-sm text-slate-400">community, religion, family-fit fields</div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="text-2xl font-semibold text-white">AI ranked</div>
                                <div className="mt-1 text-sm text-slate-400">scores with human-readable reasons</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex justify-center items-center glass-panel rounded-[2rem] p-6 sm:p-8">
                    
                    <div>


                    <div className="mb-8">
                        <div className="text-sm uppercase tracking-[0.35em] text-amber-300/90">Matchmaker Login</div>
                        <h2 className="mt-3 text-3xl font-semibold text-white">Sign in to the dashboard</h2>
                    </div>

                    <form className=" space-y-4" onSubmit={handleSubmit}>
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">Username</span>
                            <input
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/60"
                                placeholder="matchmaker@datecrew.com"
                                autoComplete="username"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/60"
                                placeholder="match123"
                                autoComplete="current-password"
                            />
                        </label>

                        {error ? (
                            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                                {error}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="gold-accent inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
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