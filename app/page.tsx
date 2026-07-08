/* ============================================================================
   app/page.tsx — ECRAN WELCOME (accueil initial de l'app)
   ----------------------------------------------------------------------------
   Premier ecran vu a l'ouverture. Inspire de Revolut (epure, hierarchie forte,
   2 gros boutons en bas) MAIS avec NOTRE palette (bleu-nuit + corail + menthe).
   Contenu :
     - Selecteur de langue en haut (FR / AR)
     - Logo Rijal Lghayth + accroche
     - 2 boutons : "Créer un compte" (principal) et "Se connecter" (secondaire)
       -> "S'inscrire"  ouvre /register
       -> "Se connecter" ouvre /login
   ============================================================================ */

'use client'

import { useRouter } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BrandLogo } from '@/components/brand-logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useLanguage } from '@/lib/i18n'

export default function WelcomePage() {
  const router = useRouter()
  const { t } = useLanguage() // textes traduits (FR / AR)

  return (
    <AppShell className="items-center">
      {/* --- Barre haute : selecteur de langue aligne cote "fin" --- */}
      <div className="flex w-full justify-end">
        <LanguageSwitcher />
      </div>

      {/* --- Zone centrale : logo + accroche --- */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <BrandLogo size={230} priority />

        {/* Accroche (le nom est deja dans le logo, on ajoute juste un slogan) */}
        <h1 className="mt-6 max-w-[18rem] text-balance font-display text-3xl font-semibold leading-tight text-foreground">
          {t.welcome.tagline}
        </h1>
        <p className="mt-3 max-w-[20rem] text-pretty text-sm leading-relaxed text-muted-foreground">
          {t.welcome.subtitle}
        </p>
      </div>

      {/* --- Bas de page : 2 boutons empiles (facon Revolut) --- */}
      <div className="mt-6 flex w-full flex-col gap-3">
        {/* Bouton PRINCIPAL : creer un compte (corail plein) */}
        <button
          type="button"
          onClick={() => router.push('/register')}
          className="h-14 w-full rounded-2xl bg-coral text-base font-semibold text-primary-foreground shadow-[0_16px_40px_-16px_rgba(255,107,74,0.7)] transition-all duration-200 hover:bg-coral/90 active:scale-[0.98]"
        >
          {t.common.register}
        </button>

        {/* Bouton SECONDAIRE : se connecter (surface discrete) */}
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="h-14 w-full rounded-2xl border border-border bg-secondary/60 text-base font-semibold text-foreground backdrop-blur transition-all duration-200 hover:bg-secondary active:scale-[0.98]"
        >
          {t.common.login}
        </button>

        {/* Note de rassurance */}
        <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          {t.welcome.secure}
        </p>
      </div>
    </AppShell>
  )
}
