'use client'

/**
 * VUE VOISIN — /alerts/[id]/respond
 * ---------------------------------
 * Ce que voit un VOISIN apres avoir clique "Je reponds" sur une alerte.
 * IMPORTANT : ce n'est PAS la vue de la victime.
 *  - La victime a la vue /alert/live (avec "Je suis en securite").
 *  - Le voisin, lui, doit se rendre chez la victime : il voit donc
 *    sa propre position (pin bleu "Vous"), la victime (pin corail),
 *    les autres voisins en route, sa distance + son temps d'arrivee,
 *    et il peut "Je suis arrive" ou "Annuler ma reponse".
 *
 * La carte est chargee dynamiquement (ssr:false) car Leaflet a besoin
 * de `window`. Le comportement est simule pour la demo.
 */

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Clock,
  Check,
  X,
  Phone,
  CheckCircle2,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'
import { getNeighborAlert, TONE_CLASSES } from '@/lib/neighbor-alerts'

/* Carte : composant client uniquement (export default -> pas de .then) */
const LiveMap = dynamic(() => import('@/components/live-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-secondary">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-coral border-t-transparent" />
    </div>
  ),
})

/* Position de la victime (centre) — Tevragh-Zeina, Nouakchott */
const VICTIM_POS = { lat: 18.0858, lng: -15.9785 }
/* Position de depart du voisin (vous) — un peu au sud-est */
const YOU_POS = { lat: 18.0831, lng: -15.9758 }

/* Autres voisins deja en route (affiches en vert menthe) */
const OTHERS = [
  { id: 'o1', name: 'Mohamed O.', lat: 18.0868, lng: -15.9772, distance: 120, responded: true },
  { id: 'o2', name: 'Aicha B.', lat: 18.0872, lng: -15.9801, distance: 310, responded: true },
]

export default function RespondPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { t, lang, dir } = useLanguage()

  const alert = getNeighborAlert(params.id)

  /* Etat local : distance restante (m) qui diminue + arrivee */
  const [remaining, setRemaining] = useState(280)
  const [arrived, setArrived] = useState(false)

  /* SIMULATION : on se rapproche de la victime toutes les 1,5 s */
  useEffect(() => {
    if (arrived) return
    const timer = setInterval(() => {
      setRemaining((d) => {
        const next = d - 35
        return next <= 0 ? 0 : next
      })
    }, 1500)
    return () => clearInterval(timer)
  }, [arrived])

  /* Temps d'arrivee estime : ~1 min pour 80 m (marche rapide) */
  const etaMin = useMemo(() => Math.max(1, Math.round(remaining / 80)), [remaining])

  /* Alerte introuvable : petit ecran de repli */
  if (!alert) {
    return (
      <AppShell>
        <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <p className="text-base text-muted-foreground">{t.alerts.empty}</p>
          <Button
            className="mt-6 rounded-2xl bg-coral text-primary-foreground"
            onClick={() => router.push('/alerts')}
          >
            {t.responder.backHome}
          </Button>
        </div>
      </AppShell>
    )
  }

  const { name, photo, Icon, tone, label, phone } = alert

  /* Formate une distance en metres ("120 m" ou "1.2 km") */
  function fmt(m: number) {
    return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`
  }

  /* ---- Ecran de confirmation "Vous etes arrive" ---- */
  if (arrived) {
    return (
      <AppShell>
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-success text-primary-foreground shadow-[0_20px_50px_-15px_rgba(34,153,84,0.6)] motion-safe:animate-in motion-safe:zoom-in-75 motion-safe:duration-500">
            <CheckCircle2 className="h-12 w-12" strokeWidth={2.4} />
          </span>
          <h1 className="mt-8 text-balance font-display text-3xl font-semibold text-foreground">
            {t.responder.arrivedTitle}
          </h1>
          <p className="mt-2 max-w-[20rem] text-pretty text-base leading-relaxed text-muted-foreground">
            {t.responder.arrivedMsg}
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/home')}
            className="mt-10 h-14 w-full rounded-2xl bg-coral text-base font-semibold text-primary-foreground hover:bg-coral/90"
          >
            {t.responder.backHome}
          </Button>
        </div>
      </AppShell>
    )
  }

  /* ---- Vue principale : carte + panneau "En route" ---- */
  return (
    <AppShell className="!px-0 !pb-0">
      {/* Barre haute */}
      <div className="flex items-center justify-between gap-3 px-5 pt-1">
        <button
          type="button"
          onClick={() => router.push(`/alerts/${params.id}`)}
          aria-label={t.common.back}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur transition-colors hover:bg-accent rtl:rotate-180"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="font-display text-lg font-semibold leading-none text-foreground">
            {t.responder.title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t.responder.helping} · {name}
          </p>
        </div>
        <span className="h-10 w-10" />
      </div>

      {/* Carte : victime au centre, vous (bleu), autres voisins (vert) */}
      <div className="relative mt-3 h-[40vh] w-full overflow-hidden">
        <LiveMap center={VICTIM_POS} responders={OTHERS} you={YOU_POS} />

        {/* Badge distance/ETA pose sur la carte */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <div className="pointer-events-auto flex items-center gap-4 rounded-full border border-[#1f6feb]/30 bg-card/90 px-5 py-2.5 shadow-lg backdrop-blur">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Navigation className="h-4 w-4 text-[#1f6feb]" />
              <span dir="ltr">{fmt(remaining)}</span>
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Clock className="h-4 w-4 text-[#1f6feb]" />
              <span dir="ltr">
                {etaMin} {t.responder.min}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Panneau bas : victime + actions */}
      <div className="flex flex-1 flex-col rounded-t-3xl border-t border-border bg-background px-5 pt-5">
        {/* Rappel de qui on aide */}
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-1 ring-border">
            <Image
              src={photo || '/placeholder.svg'}
              alt={name}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-semibold text-foreground">
              {name}
            </p>
            <span
              className={`mt-0.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${TONE_CLASSES[tone]}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label[lang]}
            </span>
          </div>
          {/* Appel rapide de la victime */}
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            aria-label={t.responder.callVictim}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-coral text-primary-foreground shadow-sm transition-transform active:scale-95"
          >
            <Phone className="h-5 w-5" />
          </a>
        </div>

        {/* Compteur autres voisins en route */}
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-success/30 bg-success/10 px-4 py-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
          </span>
          <span className="text-sm font-medium text-foreground">
            {OTHERS.length}{' '}
            {OTHERS.length <= 1
              ? t.responder.othersOne
              : t.responder.othersMany}
          </span>
        </div>

        {/* Actions bas d'ecran */}
        <div className="mt-auto flex flex-col gap-3 py-4">
          <Button
            size="lg"
            onClick={() => setArrived(true)}
            className="h-16 w-full rounded-2xl bg-success text-base font-semibold text-primary-foreground hover:bg-success/90"
          >
            <Check className={dir === 'rtl' ? 'ml-1 h-6 w-6' : 'mr-1 h-6 w-6'} />
            {t.responder.arrived}
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push(`/alerts/${params.id}`)}
            className="h-12 w-full rounded-2xl text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className={dir === 'rtl' ? 'ml-1 h-4 w-4' : 'mr-1 h-4 w-4'} />
            {t.responder.cancel}
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
