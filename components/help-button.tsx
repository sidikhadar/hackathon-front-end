/* ============================================================================
   help-button.tsx — BOUTON SIGNATURE "AIDE" (element central de l'app)
   ----------------------------------------------------------------------------
   Grand bouton rond corail avec :
     - un DOUBLE halo de pulsation (deux anneaux dephases) -> attire l'oeil
     - un leger battement du bouton (animate-soft-beat)
     - un retour tactile a l'appui (scale down) pour un feed-back immediat
   Concu pour etre compris/actionne instantanement, meme en situation de stress.
   NB : les anneaux de pulsation ont `pointer-events-none` -> ils ne bloquent
   JAMAIS le clic sur le bouton (correction : le bouton repond bien au clic).
   ============================================================================ */

'use client'

import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function HelpButton({
  onClick,
  className,
}: {
  onClick?: () => void
  className?: string
}) {
  const { t } = useLanguage()

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* --- Anneaux de pulsation (purement decoratifs, non cliquables) --- */}
      <span
        aria-hidden
        className="pointer-events-none absolute h-48 w-48 rounded-full bg-coral/10 animate-pulse-ring"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute h-48 w-48 rounded-full bg-coral/10 animate-pulse-ring"
        style={{ animationDelay: '1.1s' }}
      />

      {/* --- Bouton principal (taille reduite : 192px au lieu de 224px) --- */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`${t.home.helpBig} — ${t.home.helpSub}`}
        className={cn(
          'group relative flex h-48 w-48 flex-col items-center justify-center gap-1 rounded-full',
          'bg-coral-gradient text-primary-foreground glow-coral animate-soft-beat',
          'transition-transform duration-200 ease-out',
          'active:scale-95 active:duration-75',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/40',
        )}
      >
        {/* Reflet lumineux subtil en haut du bouton (effet volume) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-4 h-16 rounded-full bg-white/25 blur-2xl"
        />
        <span className="font-display text-4xl font-bold tracking-wide">
          {t.home.helpBig}
        </span>
        <span className="text-sm font-medium text-primary-foreground/80">
          {t.home.helpSub}
        </span>
      </button>
    </div>
  )
}
