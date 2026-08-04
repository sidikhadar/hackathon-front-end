'use client'

/**
 * PAGE DE CONFIRMATION D'ALERTE — /alert/new?type=xxx
 * ----------------------------------------------------
 * Derniere etape avant l'envoi de l'alerte. Elle affiche :
 *   - le type d'urgence choisi (recupere depuis l'URL ?type=)
 *   - un champ message OPTIONNEL
 *   - la position GPS auto-detectee (avec etat "localisation en cours")
 *   - un gros bouton "Envoyer l'alerte" avec etat de chargement rassurant
 *
 * Note : la geolocalisation utilise l'API du navigateur. Si elle echoue
 * ou est refusee, on retombe sur une position simulee (Nouakchott) pour
 * que la demo fonctionne toujours en hackathon.
 */

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2, MapPin, Send } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { EMERGENCY_TYPES } from '@/lib/emergencies'
import { useLanguage } from '@/lib/i18n'

// Position de repli (centre de Nouakchott) si le GPS est indisponible
const FALLBACK = { lat: 18.0735, lng: -15.9582, accuracy: 25 }

/**
 * La page exportee enveloppe le contenu dans <Suspense> car
 * useSearchParams() l'exige pour le build de production (Next.js).
 */
export default function AlertConfirmPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-coral" />
          </div>
        </AppShell>
      }
    >
      <AlertConfirmContent />
    </Suspense>
  )
}

function AlertConfirmContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { t, lang } = useLanguage()

  // Type d'urgence recupere depuis l'URL (?type=agression, etc.)
  const typeId = params.get('type') ?? 'autre'
  const emergency =
    EMERGENCY_TYPES.find((e) => e.id === typeId) ?? EMERGENCY_TYPES[5]

  // Etats locaux
  const [message, setMessage] = useState('') // message optionnel
  const [coords, setCoords] = useState<typeof FALLBACK | null>(null) // position
  const [sending, setSending] = useState(false) // bouton en cours d'envoi ?

  // --- Geolocalisation automatique au chargement de la page ---
  useEffect(() => {
    let done = false
    // Securite : si le GPS ne repond pas en 4s, on prend la position de repli
    const timer = setTimeout(() => {
      if (!done) setCoords(FALLBACK)
    }, 4000)

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          done = true
          clearTimeout(timer)
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
          })
        },
        () => {
          done = true
          clearTimeout(timer)
          setCoords(FALLBACK) // refus / erreur -> repli
        },
        { enableHighAccuracy: true, timeout: 3500 },
      )
    } else {
      setCoords(FALLBACK)
    }

    return () => clearTimeout(timer)
  }, [])

  const label = lang === 'ar' ? emergency.labelAr : emergency.label
  const Icon = emergency.Icon

  // --- Envoi de l'alerte (simule) -> redirige vers la carte temps reel ---
  function handleSend() {
    setSending(true)
    // On simule un court envoi reseau, puis on passe a la carte live
    setTimeout(() => {
      router.push(`/alert/live?type=${typeId}`)
    }, 1600)
  }

  return (
    <AppShell>
      {/* --- Barre haute : retour --- */}
      <div className="flex w-full items-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border bg-card/70 pe-4 ps-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t.common.back}
        </button>
      </div>

      {/* --- Titre --- */}
      <header className="mt-6">
        <h1 className="text-balance font-display text-3xl font-semibold text-foreground">
          {t.confirm.title}
        </h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
          {t.confirm.subtitle}
        </p>
      </header>

      {/* --- Carte : type d'urgence choisi --- */}
      <section className="mt-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t.confirm.typeLabel}
        </p>
        <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: `color-mix(in srgb, ${emergency.tint} 18%, transparent)`,
              color: emergency.tint,
            }}
          >
            <Icon className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <span className="font-semibold text-foreground">{label}</span>
        </div>
      </section>

      {/* --- Message optionnel --- */}
      <section className="mt-5">
        <label
          htmlFor="msg"
          className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          {t.confirm.messageLabel}
        </label>
        <textarea
          id="msg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder={t.confirm.messagePlaceholder}
          className="w-full resize-none rounded-3xl border border-border bg-card p-4 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
        />
      </section>

      {/* --- Position GPS auto-detectee --- */}
      <section className="mt-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t.confirm.locationLabel}
        </p>
        <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4">
          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success">
            {/* Halo pulsant tant que la position est en cours de detection */}
            {!coords && (
              <span className="absolute inset-0 animate-ping rounded-2xl bg-success/20" />
            )}
            <MapPin className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            {coords ? (
              <>
                <p className="font-semibold text-foreground">
                  {t.confirm.located}
                </p>
                {/* Coordonnees toujours affichees de gauche a droite (LTR) */}
                <p dir="ltr" className="text-sm text-muted-foreground">
                  {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)} ·{' '}
                  {t.confirm.accuracy} ±{coords.accuracy}m
                </p>
              </>
            ) : (
              <p className="flex items-center gap-2 font-medium text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.confirm.locating}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* --- Bas : bouton d'envoi avec etat de chargement --- */}
      <div className="mt-auto pt-8">
        <p className="mb-3 text-center text-xs leading-relaxed text-muted-foreground">
          {t.confirm.reassure}
        </p>
        <Button
          size="lg"
          onClick={handleSend}
          disabled={!coords || sending}
          className="h-16 w-full rounded-3xl bg-coral text-lg font-semibold text-primary-foreground shadow-[0_18px_45px_-16px_rgba(255,107,74,0.75)] transition-all hover:bg-coral/90 active:scale-[0.98] disabled:opacity-60"
        >
          {sending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t.confirm.sending}
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              {t.confirm.send}
            </>
          )}
        </Button>
      </div>
    </AppShell>
  )
}
