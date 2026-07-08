/* ============================================================================
   help-button.tsx — BOUTON SIGNATURE "AIDE" (element central de l'app)
   ----------------------------------------------------------------------------
   Grand bouton rond corail avec :
     - un DOUBLE halo de pulsation (deux anneaux dephasees) -> attire l'oeil
     - un leger battement du bouton (animate-soft-beat)
     - un retour tactile a l'appui (scale down) pour un feed-back immediat
   Concu pour etre compris/actionne instantanement, meme en situation de stress.
   ============================================================================ */

'use client'

import { cn } from '@/lib/utils'

export function HelpButton({
  onClick,
  className,
}: {
  onClick?: () => void
  className?: string
}) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* --- Anneaux de pulsation (decoratifs) --- */}
      <span
        aria-hidden
        className="absolute h-56 w-56 rounded-full bg-coral/10 animate-pulse-ring"
      />
      <span
        aria-hidden
        className="absolute h-56 w-56 rounded-full bg-coral/10 animate-pulse-ring"
        style={{ animationDelay: '1.1s' }}
      />

      {/* --- Bouton principal --- */}
      <button
        type="button"
        onClick={onClick}
        aria-label="Demander de l'aide en urgence"
        className={cn(
          'group relative flex h-56 w-56 flex-col items-center justify-center gap-1 rounded-full',
          'bg-coral-gradient text-primary-foreground glow-coral animate-soft-beat',
          'transition-transform duration-200 ease-out',
          'active:scale-95 active:duration-75',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/40',
        )}
      >
        {/* Reflet lumineux subtil en haut du bouton (effet volume) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-4 h-20 rounded-full bg-white/25 blur-2xl"
        />
        <span className="font-display text-5xl font-bold tracking-wide">AIDE</span>
        <span className="text-sm font-medium text-primary-foreground/80">
          Appuyez pour alerter
        </span>
      </button>
    </div>
  )
}
