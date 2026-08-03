/* ============================================================================
   app/history/page.tsx — HISTORIQUE DES ALERTES
   ----------------------------------------------------------------------------
   Accessible depuis le menu lateral. Liste les alertes passees et en cours de
   l'utilisateur : type d'urgence (icone + libelle), statut (Resolue/En cours),
   date formatee selon la langue, role (victime / aidant) et lieu.
   Bilingue FR/AR avec support RTL. Design coherent avec le reste de l'app.
   ============================================================================ */

'use client'

import { useRouter } from 'next/navigation'
import { History as HistoryIcon, CheckCircle2, Loader2 } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { AuthTopBar } from '@/components/auth-topbar'
import { useLanguage } from '@/lib/i18n'
import { EMERGENCY_TYPES } from '@/lib/emergencies'
import { HISTORY, type HistoryEntry } from '@/lib/history'

/* Formate une date ISO selon la langue active (fr-FR / ar-MA) */
function formatDate(iso: string, lang: string) {
  const locale = lang === 'ar' ? 'ar-MA' : 'fr-FR'
  return new Date(iso).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function HistoryRow({ entry }: { entry: HistoryEntry }) {
  const { t, lang } = useLanguage()
  const type = EMERGENCY_TYPES.find((e) => e.id === entry.typeId) ?? EMERGENCY_TYPES[5]
  const label = lang === 'ar' ? type.labelAr : type.label
  const resolved = entry.status === 'resolved'

  return (
    <li className="card-premium flex items-center gap-4 rounded-2xl p-4">
      {/* Icone du type d'urgence, teintee */}
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${type.tint}1f`, color: type.tint }}
        aria-hidden="true"
      >
        <type.Icon className="h-6 w-6" />
      </span>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-display text-base font-semibold text-foreground">
            {label}
          </p>
        </div>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {entry.role === 'victim' ? t.history.roleVictim : t.history.roleResponder}
          {' · '}
          {entry.place}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground/80">
          {formatDate(entry.date, lang)}
        </p>
      </div>

      {/* Badge de statut */}
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
          resolved
            ? 'bg-success/15 text-success'
            : 'bg-coral/15 text-coral'
        }`}
      >
        {resolved ? (
          <CheckCircle2 className="h-3.5 w-3.5" />
        ) : (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        )}
        {resolved ? t.history.statusResolved : t.history.statusOngoing}
      </span>
    </li>
  )
}

export default function HistoryPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <AppShell>
      <AuthTopBar onBack={() => router.push('/home')} />

      <header className="mt-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {t.history.title}
        </h1>
        <p className="mt-1 text-pretty text-sm text-muted-foreground">
          {t.history.subtitle}
        </p>
      </header>

      {HISTORY.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <HistoryIcon className="h-8 w-8" />
          </span>
          <p className="mt-5 font-display text-lg font-semibold text-foreground">
            {t.history.empty}
          </p>
          <p className="mt-1 max-w-[16rem] text-pretty text-sm text-muted-foreground">
            {t.history.emptySub}
          </p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3 pb-6">
          {HISTORY.map((entry) => (
            <HistoryRow key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </AppShell>
  )
}
