/* ============================================================================
   auth-topbar.tsx — BARRE HAUTE des pages Connexion / Inscription
   ----------------------------------------------------------------------------
   Regroupe, sur une seule ligne :
     - a gauche  : un bouton "Retour" (fleche)
     - a droite  : le selecteur de langue (FR / AR) + le bouton "Aide"
   Grace aux classes logiques (start/end), la disposition s'inverse
   automatiquement en arabe (RTL) : le retour passe a droite, etc.
   ============================================================================ */

'use client'

import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'
import { HelpContact } from '@/components/help-contact'

export function AuthTopBar({ onBack }: { onBack: () => void }) {
  const { t, dir } = useLanguage()

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Bouton retour — la fleche pointe vers le "debut" de lecture */}
      <button
        onClick={onBack}
        aria-label={t.common.back}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent"
      >
        {/* En arabe (RTL), on retourne la fleche pour qu'elle pointe a droite */}
        <ArrowLeft className={dir === 'rtl' ? 'h-5 w-5 rotate-180' : 'h-5 w-5'} />
      </button>

      {/* Langue + Aide */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <HelpContact />
      </div>
    </div>
  )
}
