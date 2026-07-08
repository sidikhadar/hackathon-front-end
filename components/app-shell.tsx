/* ============================================================================
   app-shell.tsx — COQUILLE MOBILE PREMIUM (conteneur commun a tous les ecrans)
   ----------------------------------------------------------------------------
   Role :
     - Centrer le contenu dans une colonne façon "telephone" (max ~440px)
       même sur grand ecran, pour un rendu app mobile soigne.
     - Gerer la hauteur plein ecran (min-h-dvh) + zones de securite (encoche iOS).
     - Ajouter une ambiance lumineuse discrete en arriere-plan (halos flous)
       pour donner de la profondeur, sans surcharger.
   Utilisation : <AppShell> ...contenu de la page... </AppShell>
   ============================================================================ */

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function AppShell({
  children,
  className,
}: {
  children: ReactNode
  /** Classes supplementaires pour la colonne interne (ex: alignement) */
  className?: string
}) {
  return (
    // Fond global + centrage horizontal de la colonne mobile
    <div className="relative flex min-h-dvh w-full justify-center bg-background">
      {/* --- Ambiance : halos flous fixes en arriere-plan (profondeur) --- */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        {/* Halo corail en haut (chaleur / urgence maitrisee) */}
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-coral/15 blur-[120px]" />
        {/* Halo menthe en bas (rassurance) */}
        <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-success/10 blur-[130px]" />
      </div>

      {/* --- Colonne principale (contenu reel de la page) --- */}
      <div
        className={cn(
          'relative z-10 flex w-full max-w-[440px] flex-col px-5',
          // Zones de securite : evite l'encoche / la barre de gestes iOS
          'pt-[max(1.25rem,env(safe-area-inset-top))]',
          'pb-[max(1.25rem,env(safe-area-inset-bottom))]',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
