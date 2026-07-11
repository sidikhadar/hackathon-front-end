'use client'

/**
 * PAGE CARTE TEMPS REEL — /alert/live
 * -----------------------------------
 * Affiche une carte (react-leaflet) avec :
 *  - le pin de la victime (vous) qui pulse au centre,
 *  - les pins des voisins qui ont repondu (vert menthe),
 *  - une liste de voisins avec distances + bouton "Je vais aider",
 *  - un compteur en direct ("X voisins en route").
 *
 * NOTE : la carte est chargee dynamiquement (ssr: false) car Leaflet a
 * besoin de l'objet `window` du navigateur, qui n'existe pas cote serveur.
 * Le comportement (voisins qui repondent) est SIMULE avec un minuteur.
 */

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ArrowLeft, Check, MapPin, Navigation, ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/* Chargement de la carte uniquement cote client (pas de rendu serveur) */
const LiveMap = dynamic(() => import('@/components/live-map').then((m) => m.LiveMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-secondary">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-coral border-t-transparent" />
    </div>
  ),
})

/* Type d'un voisin affiche sur la carte + dans la liste */
export type Neighbor = {
  id: string
  name: string
  distance: number // en metres
  lat: number
  lng: number
  responded: boolean // a clique "Je vais aider" ?
}

/* Position de la victime (centre de la carte) — Tevragh-Zeina, Nouakchott */
const VICTIM_POS = { lat: 18.0858, lng: -15.9785 }

/* Liste initiale de voisins simules autour de la victime */
const INITIAL_NEIGHBORS: Neighbor[] = [
  { id: 'n1', name: 'Mohamed O.', distance: 120, lat: 18.0868, lng: -15.9772, responded: false },
  { id: 'n2', name: 'Fatimetou M.', distance: 240, lat: 18.0845, lng: -15.9799, responded: false },
  { id: 'n3', name: 'Sidi A.', distance: 310, lat: 18.0872, lng: -15.9801, responded: false },
  { id: 'n4', name: 'Aicha B.', distance: 480, lat: 18.0839, lng: -15.9765, responded: false },
]

export default function LiveAlertPage() {
  const router = useRouter()
  const { t, lang } = useLanguage()

  const [neighbors, setNeighbors] = useState<Neighbor[]>(INITIAL_NEIGHBORS)

  /* SIMULATION : deux voisins repondent automatiquement apres quelques
     secondes, pour montrer le compteur qui augmente en direct. */
  useEffect(() => {
    const t1 = setTimeout(() => {
      setNeighbors((prev) =>
        prev.map((n) => (n.id === 'n1' ? { ...n, responded: true } : n)),
      )
    }, 2500)
    const t2 = setTimeout(() => {
      setNeighbors((prev) =>
        prev.map((n) => (n.id === 'n2' ? { ...n, responded: true } : n)),
      )
    }, 5000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  /* Nombre de voisins "en route" (recalcule a chaque changement) */
  const enRoute = useMemo(
    () => neighbors.filter((n) => n.responded).length,
    [neighbors],
  )

  /* Bascule manuelle du bouton "Je vais aider" pour un voisin */
  function toggleHelp(id: string) {
    setNeighbors((prev) =>
      prev.map((n) => (n.id === id ? { ...n, responded: !n.responded } : n)),
    )
  }

  /* Formate une distance en metres ("120 m" ou "1.2 km") */
  function formatDistance(m: number) {
    return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`
  }

  return (
    <AppShell className="!px-0 !pb-0">
      {/* --- Barre haute (au-dessus de la carte) --- */}
      <div className="flex items-center justify-between gap-3 px-5 pt-1">
        <button
          type="button"
          onClick={() => router.push('/home')}
          aria-label={t.common.back}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur transition-colors hover:bg-accent rtl:rotate-180"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="text-center">
          <p className="font-display text-lg font-semibold leading-none text-foreground">
            {t.live.title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t.live.subtitle}</p>
        </div>

        {/* Espace symetrique pour centrer le titre */}
        <span className="h-10 w-10" />
      </div>

      {/* --- Carte temps reel --- */}
      <div className="relative mt-3 h-[42vh] w-full overflow-hidden">
        <LiveMap
          victim={VICTIM_POS}
          neighbors={neighbors}
          youLabel={t.live.youHere}
        />

        {/* Badge compteur "X voisins en route" pose sur la carte */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-success/30 bg-card/90 px-4 py-2 shadow-lg backdrop-blur">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            <span className="text-sm font-semibold text-foreground">
              {enRoute}{' '}
              {enRoute <= 1 ? t.live.enRouteOne : t.live.enRouteMany}
            </span>
          </div>
        </div>
      </div>

      {/* --- Liste des voisins (feuille arrondie sous la carte) --- */}
      <div className="flex flex-1 flex-col rounded-t-3xl border-t border-border bg-background px-5 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">
            {t.live.neighborsTitle}
          </h2>
          <span className="text-xs text-muted-foreground">
            {neighbors.length} {t.live.notified}
          </span>
        </div>

        {/* Cartes voisins (defilables) */}
        <div className="flex flex-col gap-2.5 overflow-y-auto pb-4">
          {neighbors.map((n) => (
            <div
              key={n.id}
              className={cn(
                'flex items-center gap-3 rounded-2xl border p-3 transition-colors',
                n.responded
                  ? 'border-success/40 bg-success/10'
                  : 'border-border bg-card',
              )}
            >
              {/* Pastille avec initiale du voisin */}
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                  n.responded
                    ? 'bg-success text-primary-foreground'
                    : 'bg-secondary text-foreground',
                )}
              >
                {n.name.charAt(0)}
              </span>

              {/* Nom + distance */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {n.name}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 text-coral" />
                  {t.live.away} {formatDistance(n.distance)}
                </p>
              </div>

              {/* Bouton "Je vais aider" / etat "En route" */}
              <Button
                size="sm"
                onClick={() => toggleHelp(n.id)}
                className={cn(
                  'h-9 shrink-0 rounded-full px-3 text-xs font-semibold transition-all',
                  n.responded
                    ? 'bg-success/20 text-success hover:bg-success/30'
                    : 'bg-coral text-primary-foreground hover:bg-coral/90',
                )}
              >
                {n.responded ? (
                  <>
                    <Check className="mr-1 h-3.5 w-3.5" />
                    {t.live.responded}
                  </>
                ) : (
                  <>
                    <Navigation className="mr-1 h-3.5 w-3.5" />
                    {t.live.willHelp}
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Bouton bas : marquer l'alerte comme resolue */}
        <div className="mt-auto border-t border-border py-4">
          <Button
            size="lg"
            onClick={() => router.push('/home')}
            className="h-13 w-full rounded-2xl bg-success text-base font-semibold text-primary-foreground hover:bg-success/90"
          >
            <ShieldCheck className="mr-1 h-5 w-5" />
            {t.live.resolved}
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
