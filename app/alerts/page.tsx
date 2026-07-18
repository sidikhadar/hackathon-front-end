/* ============================================================================
   app/alerts/page.tsx — ALERTES DES VOISINS
   ----------------------------------------------------------------------------
   Atteinte via la CLOCHE de notifications de l'accueil. Liste les voisins
   proches ayant lance une alerte : nom, type d'urgence, distance, delai, et
   un bouton "Je reponds". Donnees simulees pour la demonstration.
   Bilingue (FR / AR) + sens de lecture automatique (RTL en arabe).
   ============================================================================ */

'use client'

import { useRouter } from 'next/navigation'
import {
  Flame,
  HeartPulse,
  MapPin,
  ShieldAlert,
  Car,
  type LucideIcon,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { AuthTopBar } from '@/components/auth-topbar'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'

// Type d'une alerte de voisin (donnees simulees)
type Alert = {
  id: number
  name: string
  icon: LucideIcon
  tone: 'coral' | 'success' | 'amber'
  label: { fr: string; ar: string }
  distance: string
  time: { fr: string; ar: string }
}

// Liste de demonstration (a remplacer par de vraies donnees plus tard)
const ALERTS: Alert[] = [
  {
    id: 1,
    name: 'Fatimetou',
    icon: HeartPulse,
    tone: 'coral',
    label: { fr: 'Urgence médicale', ar: 'حالة طبية طارئة' },
    distance: '120 m',
    time: { fr: 'il y a 2 min', ar: 'قبل دقيقتين' },
  },
  {
    id: 2,
    name: 'Mohamed',
    icon: ShieldAlert,
    tone: 'amber',
    label: { fr: 'Personne suspecte', ar: 'شخص مشبوه' },
    distance: '340 m',
    time: { fr: 'il y a 8 min', ar: 'قبل 8 دقائق' },
  },
  {
    id: 3,
    name: 'Aïcha',
    icon: Flame,
    tone: 'coral',
    label: { fr: 'Début d’incendie', ar: 'بداية حريق' },
    distance: '500 m',
    time: { fr: 'il y a 15 min', ar: 'قبل 15 دقيقة' },
  },
  {
    id: 4,
    name: 'Sidi',
    icon: Car,
    tone: 'success',
    label: { fr: 'Accident de route', ar: 'حادث سير' },
    distance: '1,2 km',
    time: { fr: 'il y a 22 min', ar: 'قبل 22 دقيقة' },
  },
]

// Classes de couleur selon la "tonalite" de l'alerte
const TONE: Record<Alert['tone'], string> = {
  coral: 'bg-coral/15 text-coral',
  success: 'bg-success/15 text-success',
  amber: 'bg-amber-500/15 text-amber-600',
}

export default function AlertsPage() {
  const router = useRouter()
  const { t, lang } = useLanguage()

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

      {/* Liste des alertes des voisins */}
      <ul className="mt-6 flex flex-col gap-3 pb-4">
        {ALERTS.map(({ id, name, icon: Icon, tone, label, distance, time }) => (
          <li key={id} className="card-premium flex items-center gap-3 p-4">
            {/* Icone du type d'urgence */}
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${TONE[tone]}`}
            >
              <Icon className="h-6 w-6" />
            </span>

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

            {/* Bouton de reponse */}
            <Button
              size="sm"
              className="shrink-0 rounded-full bg-coral text-xs font-semibold text-primary-foreground hover:bg-coral/90"
            >
              {t.alerts.respond}
            </Button>
          </li>
        ))}
      </ul>
    </AppShell>
  )
}
