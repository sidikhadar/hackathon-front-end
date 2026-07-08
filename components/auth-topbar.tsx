/* ============================================================================
   auth-topbar.tsx — EN-TETE des pages Connexion / Inscription
   ----------------------------------------------------------------------------
   Une seule ligne, identique sur les 2 pages :
     - cote DEBUT (gauche en FR) : embleme + titre "Rijal Lghayth"
     - cote FIN   (droite en FR) : bouton "Retour"
   Pas de selecteur de langue ni de bouton Aide ici : la langue se choisit
   uniquement sur l'ecran d'accueil (Welcome). Les classes logiques start/end
   inversent automatiquement la disposition en arabe (RTL).
   ============================================================================ */

'use client'

import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { Emblem } from '@/components/emblem'

export function AuthTopBar({ onBack }: { onBack: () => void }) {
  const { t, dir } = useLanguage()

  return (
    <div className="flex items-center justify-between gap-3">
      {/* --- Embleme + titre de la marque --- */}
      <div className="flex items-center gap-2.5">
        <Emblem size={44} priority />
        <span className="font-display text-xl font-semibold tracking-tight text-foreground">
          {t.common.brand}
        </span>
      </div>

      {/* --- Bouton retour (pilule avec fleche + libelle) --- */}
      <button
        onClick={onBack}
        className="flex h-11 items-center gap-1.5 rounded-full bg-secondary px-4 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
      >
        {/* En arabe (RTL) la fleche est retournee pour pointer dans le bon sens */}
        <ArrowLeft className={dir === 'rtl' ? 'h-4 w-4 rotate-180' : 'h-4 w-4'} />
        {t.common.back}
      </button>
    </div>
  )
}
