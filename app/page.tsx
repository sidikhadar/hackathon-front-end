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

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BrandLogo } from '@/components/brand-logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useLanguage } from '@/lib/i18n'

export default function WelcomePage() {
  const { t } = useLanguage() // textes traduits (FR / AR)

  return (
    <AppShell className="items-center">
      {/* --- Barre haute : selecteur de langue aligne cote "fin" --- */}
      <div className="flex w-full justify-end">
        <LanguageSwitcher />
      </div>

      {/* --- Zone centrale : logo + UNE seule phrase (la 2e) --- */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <BrandLogo size={210} priority />

        {/* Une seule phrase sous le logo (le nom est deja dans l'image) */}
        <p className="mt-8 max-w-[20rem] text-pretty text-base leading-relaxed text-muted-foreground">
          {t.welcome.subtitle}
        </p>
      </div>

      {/* --- Bas de page : 2 boutons empiles (facon Revolut) ---
          On utilise <Link> (navigation Next.js robuste et fiable) stylise
          comme un bouton, au lieu d'un onClick : la navigation fonctionne
          meme si le JavaScript n'est pas encore totalement charge. */}
      <div className="mt-6 flex w-full flex-col gap-3">
        {/* Bouton PRINCIPAL : creer un compte (corail plein) -> /register */}
        <Link
          href="/register"
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-coral text-base font-semibold text-primary-foreground shadow-[0_16px_40px_-16px_rgba(255,107,74,0.7)] transition-all duration-200 hover:bg-coral/90 active:scale-[0.98]"
        >
          {t.common.register}
        </Link>

        {/* Bouton SECONDAIRE : se connecter (surface discrete) -> /login */}
        <Link
          href="/login"
          className="flex h-14 w-full items-center justify-center rounded-2xl border border-border bg-secondary/60 text-base font-semibold text-foreground backdrop-blur transition-all duration-200 hover:bg-secondary active:scale-[0.98]"
        >
          {t.common.login}
        </Link>

        {/* Note de rassurance */}
        <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          {t.welcome.secure}
        </p>
      </div>
    </AppShell>
  )
}
