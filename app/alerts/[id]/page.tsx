/* ============================================================================
   app/alerts/[id]/page.tsx — DETAIL D'UNE ALERTE RECUE
   ----------------------------------------------------------------------------
   Ce que voit un voisin quand il ouvre une alerte :
     - Photo + nom de la victime, type d'urgence, heure, distance
     - Badge de gravite hierarchise (vert = faible, orange = moderee, rouge = critique)
     - Le message laisse par la victime
     - 4 gros boutons d'appel rapide (Police, Pompiers, Ambulance, Victime)
       -> couleurs + icones distinctes, gros au pouce, utilisables sous stress
     - Bouton principal "Je reponds" -> vue voisin "En route" (/alerts/[id]/respond)
   Bilingue (FR / AR) avec sens de lecture automatique.
   ============================================================================ */

'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  MapPin,
  Clock,
  Siren,
  Flame,
  Ambulance,
  Phone,
  HandHeart,
  type LucideIcon,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { AuthTopBar } from '@/components/auth-topbar'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'
import {
  getNeighborAlert,
  TONE_CLASSES,
  type Severity,
} from '@/lib/neighbor-alerts'

export default function AlertDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { t, lang, dir } = useLanguage()

  const alert = getNeighborAlert(params.id)

  // Alerte introuvable : petit ecran de repli propre
  if (!alert) {
    return (
      <AppShell>
        <AuthTopBar onBack={() => router.push('/alerts')} />
        <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <p className="text-base text-muted-foreground">{t.alerts.empty}</p>
        </div>
      </AppShell>
    )
  }

  const { name, photo, Icon, tone, severity, label, message, distance, time } =
    alert

  // Libelle + classes du badge de gravite (vert / orange / rouge)
  const severityMap: Record<
    Severity,
    { text: string; classes: string; dot: string }
  > = {
    low: {
      text: t.detail.severityLow,
      classes: 'bg-success/15 text-success',
      dot: 'bg-success',
    },
    medium: {
      text: t.detail.severityMedium,
      classes: 'bg-amber-500/15 text-amber-600',
      dot: 'bg-amber-500',
    },
    high: {
      text: t.detail.severityHigh,
      classes: 'bg-coral/15 text-coral',
      dot: 'bg-coral',
    },
  }
  const sev = severityMap[severity]

  // Les 4 boutons d'appel rapide (couleur + icone distinctes)
  const quickCalls: {
    key: string
    label: string
    Icon: LucideIcon
    tel: string
    className: string
  }[] = [
    {
      key: 'police',
      label: t.detail.police,
      Icon: Siren,
      tel: '17',
      className: 'bg-[#1f6feb] text-white hover:bg-[#1a5fd0]',
    },
    {
      key: 'firefighters',
      label: t.detail.firefighters,
      Icon: Flame,
      tel: '18',
      className: 'bg-[#e8590c] text-white hover:bg-[#d24e08]',
    },
    {
      key: 'ambulance',
      label: t.detail.ambulance,
      Icon: Ambulance,
      tel: '15',
      className: 'bg-success text-white hover:bg-success/90',
    },
    {
      key: 'victim',
      label: t.detail.callVictim,
      Icon: Phone,
      tel: alert.phone.replace(/\s/g, ''),
      className: 'bg-coral text-primary-foreground hover:bg-coral/90',
    },
  ]

  return (
    <AppShell>
      <AuthTopBar onBack={() => router.push('/alerts')} />

      {/* --- Carte principale : identite de la victime + urgence --- */}
      <section className="card-premium mt-8 p-5">
        <div className="flex items-center gap-4">
          {/* Photo de la victime */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-border">
            <Image
              src={photo || '/placeholder.svg'}
              alt={name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>

          {/* Nom + badge de gravite */}
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-2xl font-semibold text-foreground">
              {name}
            </h1>
            <span
              className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${sev.classes}`}
            >
              <span className={`h-2 w-2 rounded-full ${sev.dot}`} />
              {t.detail.severityLabel} · {sev.text}
            </span>
          </div>
        </div>

        {/* Type d'urgence + meta (heure, distance) */}
        <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONE_CLASSES[tone]}`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {label[lang]}
            </p>
            <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {time[lang]}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-coral" />
                {t.detail.distanceAway} <span dir="ltr">{distance}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- Message laisse par la victime --- */}
      <section className="mt-4">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t.detail.messageLabel}
        </h2>
        <div className="card-premium p-4">
          <p className="text-pretty text-sm leading-relaxed text-foreground">
            {message[lang] || t.detail.noMessage}
          </p>
        </div>
      </section>

      {/* --- Appels d'urgence : 4 gros boutons (grille 2x2) --- */}
      <section className="mt-5">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t.detail.quickCall}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickCalls.map(({ key, label, Icon: CallIcon, tel, className }) => (
            <a
              key={key}
              href={`tel:${tel}`}
              className={`flex h-20 flex-col items-center justify-center gap-1.5 rounded-2xl font-semibold shadow-sm transition-transform active:scale-[0.97] ${className}`}
            >
              <CallIcon className="h-7 w-7" strokeWidth={2.2} />
              <span className="text-sm">{label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* --- Bouton principal : Je reponds -> vue voisin "En route" --- */}
      <div className="mt-auto pt-6">
        <Button
          size="lg"
          onClick={() => router.push(`/alerts/${alert.id}/respond`)}
          className="h-16 w-full rounded-2xl bg-foreground text-base font-semibold text-background hover:bg-foreground/90"
        >
          <HandHeart className={dir === 'rtl' ? 'ml-1 h-6 w-6' : 'mr-1 h-6 w-6'} />
          {t.detail.respond}
        </Button>
      </div>
    </AppShell>
  )
}
