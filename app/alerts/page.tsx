/* ============================================================================
   app/alerts/page.tsx — ALERTES DES VOISINS
   ----------------------------------------------------------------------------
   Atteinte via la CLOCHE de notifications de l'accueil. Liste les voisins
   proches ayant lance une alerte : photo, nom, type, distance, delai. Toucher
   une carte (ou "Je reponds") ouvre le DETAIL de l'alerte (/alerts/[id]).
   Donnees partagees depuis lib/neighbor-alerts. Bilingue (FR / AR).
   ============================================================================ */

'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { MapPin, ChevronRight } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { AuthTopBar } from '@/components/auth-topbar'
import { useLanguage } from '@/lib/i18n'
import { NEIGHBOR_ALERTS, TONE_CLASSES } from '@/lib/neighbor-alerts'

export default function AlertsPage() {
  const router = useRouter()
  const { t, lang, dir } = useLanguage()

  return (
    <AppShell>
      <AuthTopBar onBack={() => router.push('/home')} />

      <header className="mt-8">
        <h1 className="text-balance font-display text-3xl font-semibold text-foreground">
          {t.alerts.title}
        </h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
          {t.alerts.subtitle}
        </p>
      </header>

      {/* Liste des alertes des voisins (chaque carte ouvre le detail) */}
      <ul className="mt-6 flex flex-col gap-3 pb-4">
        {NEIGHBOR_ALERTS.map(
          ({ id, name, photo, Icon, tone, label, distance, time }) => (
            <li key={id}>
              <button
                onClick={() => router.push(`/alerts/${id}`)}
                className="card-premium flex w-full items-center gap-3 p-3 text-start transition-transform active:scale-[0.99]"
              >
                {/* Photo de la victime avec pastille du type d'urgence */}
                <div className="relative shrink-0">
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl ring-1 ring-border">
                    <Image
                      src={photo || '/placeholder.svg'}
                      alt={name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <span
                    className={`absolute -bottom-1 -end-1 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-card ${TONE_CLASSES[tone]}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                </div>

                {/* Infos : nom, type, distance + delai */}
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {name}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {label[lang]}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-coral" />
                    {t.alerts.distance} <span dir="ltr">{distance}</span>
                    <span aria-hidden>·</span>
                    {time[lang]}
                  </p>
                </div>

                {/* Chevron d'ouverture (retourne en RTL) */}
                <ChevronRight
                  className={
                    dir === 'rtl'
                      ? 'h-5 w-5 shrink-0 rotate-180 text-muted-foreground'
                      : 'h-5 w-5 shrink-0 text-muted-foreground'
                  }
                />
              </button>
            </li>
          ),
        )}
      </ul>
    </AppShell>
  )
}
