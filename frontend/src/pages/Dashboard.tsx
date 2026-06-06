import { useMemo, useState } from 'react'

import type {
    AuthUser,
    CustomerDetail,
    CustomerSummary,
    DashboardData,
    MatchProfile,
    SendMatchResult,
} from '../types'

type DashboardProps = {
    user: AuthUser
    customers: CustomerSummary[]
    dashboard: DashboardData | null
    selectedCustomerId: string | null
    selectedCustomer: CustomerDetail | null
    selectedSummary: CustomerSummary | null
    matchPool: MatchProfile[]
    loading: boolean
    actionLoading: boolean
    error: string | null
    onLogout: () => void
    onSelectCustomer: (customerId: string) => Promise<void>
    onAddNote: (note: string) => Promise<void>
    onSendMatch: (profileId: string) => Promise<SendMatchResult>
}

type PairCardProps = {
    label: string
    value: string | number | boolean | undefined
}

function PairCard({ label, value }: PairCardProps) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">{label}</div>
            <div className="mt-2 text-base font-bold text-slate-800">{String(value ?? '—')}</div>
        </div>
    )
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
}

function formatScore(value: number | undefined) {
    if (typeof value !== 'number') {
        return '—'
    }

    return `${value}/100`
}

function Dashboard({
    user,
    customers,
    dashboard,
    selectedCustomerId,
    selectedCustomer,
    selectedSummary,
    matchPool,
    loading,
    actionLoading,
    error,
    onLogout,
    onSelectCustomer,
    onAddNote,
    onSendMatch,
}: DashboardProps) {
    const [search, setSearch] = useState('')
    const [note, setNote] = useState('')
    const [modalResult, setModalResult] = useState<SendMatchResult | null>(null)
    const [sendingProfileId, setSendingProfileId] = useState<string | null>(null)

    const filteredCustomers = useMemo(() => {
        const term = search.trim().toLowerCase()

        if (!term) {
            return customers
        }

        return customers.filter((customer) => {
            const searchable = [customer.firstName, customer.lastName, customer.city, customer.maritalStatus, customer.statusTag, customer.journeyStage]
                .join(' ')
                .toLowerCase()

            return searchable.includes(term)
        })
    }, [customers, search])

    async function handleNoteSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!note.trim()) {
            return
        }

        await onAddNote(note.trim())
        setNote('')
    }

    async function handleSend(profileId: string) {
        setSendingProfileId(profileId)
        try {
            const result = await onSendMatch(profileId)
            setModalResult(result)
        } finally {
            setSendingProfileId(null)
        }
    }

    const detailFields = selectedCustomer
        ? [
            ['First Name', selectedCustomer.firstName],
            ['Last Name', selectedCustomer.lastName],
            ['Gender', selectedCustomer.gender],
            ['Date of Birth', new Date(selectedCustomer.dateOfBirth).toLocaleDateString('en-IN')],
            ['Country', selectedCustomer.country],
            ['City', selectedCustomer.city],
            ['Height', `${selectedCustomer.heightCm} cm`],
            ['Email', selectedCustomer.email],
            ['Phone Number', selectedCustomer.phoneNumber],
            ['Undergraduate College', selectedCustomer.undergraduateCollege],
            ['Degree', selectedCustomer.degree],
            ['Income', formatCurrency(selectedCustomer.income)],
            ['Current Company', selectedCustomer.currentCompany],
            ['Designation', selectedCustomer.designation],
            ['Marital Status', selectedCustomer.maritalStatus],
            ['Languages Known', selectedCustomer.languagesKnown.join(', ')],
            ['Siblings', selectedCustomer.siblings],
            ['Caste', selectedCustomer.caste],
            ['Religion', selectedCustomer.religion],
            ['Want Kids', selectedCustomer.wantKids],
            ['Open to Relocate', selectedCustomer.openToRelocate],
            ['Open to Pets', selectedCustomer.openToPets],
            ['Mother Tongue', selectedCustomer.motherTongue],
            ['Community', selectedCustomer.community],
            ['Diet', selectedCustomer.diet],
            ['Smoking', selectedCustomer.smoking],
            ['Drinking', selectedCustomer.drinking],
            ['Family Type', selectedCustomer.familyType],
            ['Manglik Status', selectedCustomer.manglikStatus],
            ['Verified', selectedCustomer.profileVerified ? 'Yes' : 'No'],
        ]
        : []

    return (
        <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-800">
            <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] flex-col gap-4">
                <header className="rounded-[1.75rem] px-5 py-4 border border-slate-200 bg-white shadow-md sm:px-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="text-xs uppercase tracking-[0.35em] text-amber-600 font-semibold">Matchmaker Desk</div>
                            <h1 className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">Welcome back, {user.displayName}</h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Reviewing {dashboard?.metrics.assignedCustomers ?? customers.length} assigned customers and {matchPool.length} live opposite-gender matches.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={onLogout}
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 font-medium transition hover:bg-slate-100 hover:text-slate-900 shadow-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 font-medium">
                        {error}
                    </div>
                ) : null}

                <section className="grid flex-1 gap-4 xl:grid-cols-[300px_minmax(0,1.35fr)_430px]">
                    <aside className="flex flex-col rounded-[1.75rem] p-4 border border-slate-200 bg-white shadow-md">
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                            <PairCard label="Assigned" value={dashboard?.metrics.assignedCustomers ?? customers.length} />
                            <PairCard label="Journey Active" value={dashboard?.metrics.activeJourney ?? 0} />
                            <PairCard label="Notes" value={dashboard?.metrics.totalNotes ?? 0} />
                            <PairCard label="Matches Sent" value={dashboard?.metrics.matchesSent ?? 0} />
                        </div>

                        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 shadow-sm">
                            <div className="h-10 w-10 rounded-full gold-accent shadow-sm" />
                            <div>
                                <div className="text-sm font-semibold text-slate-800">{user.displayName}</div>
                                <div className="text-xs text-slate-500">{user.username}</div>
                            </div>
                        </div>

                        <label className="mt-5 block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Search customers</span>
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Name, city, status..."
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white shadow-sm focus:ring-1 focus:ring-amber-500"
                            />
                        </label>

                        <div className="mt-5 flex-1 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-inner">
                            <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                Customers
                            </div>
                            <div className="max-h-[calc(100vh-28rem)] overflow-y-auto p-2">
                                {filteredCustomers.map((customer) => {
                                    const active = customer.id === selectedCustomerId

                                    return (
                                        <button
                                            key={customer.id}
                                            type="button"
                                            onClick={() => onSelectCustomer(customer.id)}
                                            className={`mb-2 w-full rounded-2xl border p-4 text-left transition shadow-sm ${active
                                                ? 'border-amber-300 bg-amber-50'
                                                : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-800">
                                                        {customer.firstName} {customer.lastName}
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500 font-medium">
                                                        {customer.age} · {customer.city} · {customer.maritalStatus}
                                                    </div>
                                                </div>
                                                <span className="rounded-full text-center border border-slate-200 bg-slate-100/50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                                    {customer.statusTag}
                                                </span>
                                            </div>
                                            <div className="mt-2 text-xs font-semibold text-slate-400">{customer.journeyStage}</div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </aside>

                    <section className="rounded-[1.75rem] p-5 sm:p-6 border border-slate-200 bg-white shadow-md">
                        {loading && !selectedCustomer ? (
                            <div className="flex h-full min-h-[500px] items-center justify-center text-sm font-medium text-slate-400">
                                Loading customer details...
                            </div>
                        ) : selectedCustomer ? (
                            <div className="space-y-6">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-3xl font-bold text-slate-800">
                                                {selectedCustomer.firstName} {selectedCustomer.lastName}
                                            </h2>
                                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                {selectedSummary?.journeyStage || selectedCustomer.journeyStage}
                                            </span>
                                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                                                {selectedSummary?.statusTag || selectedCustomer.statusTag}
                                            </span>
                                        </div>
                                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 font-medium">{selectedCustomer.bio}</p>
                                    </div>

                                    <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-700 shadow-sm">
                                        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Journey snapshot</div>
                                        <div className="mt-2 space-y-1">
                                            <div>City: {selectedCustomer.city}</div>
                                            <div>Age: {selectedSummary?.age ?? '—'}</div>
                                            <div>Gender: {selectedCustomer.gender}</div>
                                            <div>Verified: {selectedCustomer.profileVerified ? 'Yes' : 'No'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/50 shadow-inner">
                                    <div className="max-h-[500px] overflow-auto">
                                        <table className="w-full border-collapse text-sm">
                                            <thead className="sticky top-0 bg-slate-100 z-10 border-b border-slate-200">
                                                <tr>
                                                    <th className="border-b border-slate-200 px-6 py-4 text-left font-bold text-slate-700">
                                                        Field
                                                    </th>
                                                    <th className="border-b border-slate-200 px-6 py-4 text-left font-bold text-slate-700">
                                                        Value
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {detailFields.map(([label, value]) => (
                                                    <tr
                                                        key={label}
                                                        className="border-b border-slate-100 hover:bg-slate-100/50 transition"
                                                    >
                                                        <td className="px-6 py-4 font-medium text-slate-600">
                                                            {label}
                                                        </td>

                                                        <td className="px-6 py-4 text-slate-800 break-words font-semibold">
                                                            {String(value ?? '—')}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="grid gap-4 lg:grid-cols-2">
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50/30 p-5 shadow-sm">
                                        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Notes</div>
                                        <form className="mt-4 space-y-3" onSubmit={handleNoteSubmit}>
                                            <textarea
                                                value={note}
                                                onChange={(event) => setNote(event.target.value)}
                                                rows={4}
                                                placeholder="Write a quick note from the call or meeting..."
                                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                            />
                                            <button
                                                type="submit"
                                                className="gold-accent inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95 shadow-md"
                                            >
                                                Save note
                                            </button>
                                        </form>

                                        <div className="mt-5 space-y-3">
                                            {selectedCustomer.notes?.length ? (
                                                selectedCustomer.notes.map((item) => (
                                                    <div key={item._id} className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-sm">
                                                        <div className="font-semibold text-slate-800">{item.authorName}</div>
                                                        <div className="mt-1 text-xs text-slate-500">
                                                            {new Date(item.createdAt).toLocaleString('en-IN')}
                                                        </div>
                                                        <p className="mt-2 leading-6">{item.note}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-400 font-medium text-center">
                                                    No notes yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-3xl border border-slate-200 bg-slate-50/30 p-5 shadow-sm">
                                        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Previous match sends</div>
                                        <div className="mt-4 space-y-3">
                                            {selectedCustomer.sentMatches?.length ? (
                                                selectedCustomer.sentMatches.map((item) => (
                                                    <div key={item._id} className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-sm">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="font-semibold text-slate-800">{item.profileName}</div>
                                                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 text-xs text-slate-500">
                                                            AI {item.aiScore ?? item.score} · Normal {item.normalScore ?? '—'}
                                                        </div>
                                                        <p className="mt-2 leading-6 text-slate-600 font-medium">{item.reasonSummary}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-400 font-medium text-center">
                                                    No sent matches yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full min-h-[500px] items-center justify-center text-sm font-medium text-slate-400">
                                Pick a customer from the list to open the detailed matchmaking view.
                            </div>
                        )}
                    </section>

                    <aside className="rounded-[1.75rem] p-5 border border-slate-200 bg-white shadow-md">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Match pool</div>
                                <h3 className="mt-2 text-xl font-bold text-slate-800">AI-ranked suggestions</h3>
                            </div>
                            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                                {matchPool.length} live profiles
                            </div>
                        </div>

                        <div className="mt-4 max-h-[calc(100vh-12rem)] space-y-3 overflow-y-auto pr-1">
                            {matchPool.map((match) => (
                                <div key={match._id} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4 shadow-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-base font-semibold text-slate-800">
                                                {match.firstName} {match.lastName}
                                            </div>
                                            <div className="mt-1 text-xs text-slate-500 font-medium">
                                                {match.age} · {match.city} · {match.designation}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 text-right">
                                            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                                                AI {formatScore(match.aiScore ?? match.score)}
                                            </span>
                                            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                                                Normal {formatScore(match.normalScore)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="rounded-full text-center border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm">
                                            {match.label}
                                        </span>
                                        {match.profileVerified ? (
                                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                                Verified
                                            </span>
                                        ) : null}
                                        <span className="rounded-full text-center border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm">
                                            {match.religion}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-sm leading-6 text-slate-600 font-medium">{match.aiInsight}</p>
                                    <p className="mt-2 text-xs leading-5 text-slate-500 font-medium">{match.introLine}</p>

                                    <button
                                        type="button"
                                        onClick={() => void handleSend(match._id)}
                                        disabled={actionLoading || sendingProfileId === match._id}
                                        className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {sendingProfileId === match._id ? 'Sending match...' : 'Send Match'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </aside>
                </section>
            </div>

            {modalResult ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8 backdrop-blur-sm">
                    <div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-[1.75rem] p-6 border border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 font-bold">Match sent</div>
                                <h3 className="mt-2 text-2xl font-bold text-slate-800">{modalResult.match.firstName} {modalResult.match.lastName}</h3>
                                <p className="mt-2 text-sm text-slate-500 font-medium">{modalResult.message}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalResult(null)}
                                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 font-medium transition hover:bg-slate-100 hover:text-slate-800 shadow-sm"
                            >
                                Close
                            </button>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <PairCard label="AI Score" value={formatScore(modalResult.match.aiScore ?? modalResult.match.score)} />
                            <PairCard label="Normal Score" value={formatScore(modalResult.match.normalScore)} />
                            <PairCard label="Label" value={modalResult.match.label} />
                        </div>

                        <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-inner">
                            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Mock email subject</div>
                            <div className="mt-2 text-sm font-bold text-slate-800">{modalResult.intro.subject}</div>
                            <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600 font-medium shadow-sm">
                                {modalResult.intro.body}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </main>
    )
}

export default Dashboard
