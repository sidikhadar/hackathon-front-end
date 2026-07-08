/* ============================================================================
   app/home/page.tsx — ACCUEIL APRES CONNEXION (ecran du bouton "AIDE")
   ----------------------------------------------------------------------------
   Ecran central de l'app, atteint APRES une connexion/inscription reussie.
   Contient :
     - le logo officiel (agrandi) sans texte duplique
     - le BOUTON SIGNATURE "AIDE" (halo pulsant) au centre -> ouvre la grille
       des 6 types d'urgence
     - un bandeau de reassurance (voisins actifs / temps de reponse)
     - l'APPEL RAPIDE POLICE (117), disponible en permanence
   Tous les textes s'adaptent a la langue choisie (FR / AR + RTL).
   ============================================================================ */

'use client'

import { useState } from 'react'
import { ShieldCheck, Users } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BrandLogo } from '@/components/brand-logo'
import { HelpButton } from '@/components/help-button'
import { EmergencySheet } from '@/components/emergency-sheet'
import { PoliceQuickCall } from '@/components/police-quick-call'
import { HomeHeader } from '@/components/home-header'
import { useLanguage } from '@/lib/i18n'

export default function HomePage() {
  const { t } = useLanguage() // textes traduits
  const [sheetOpen, setSheetOpen] = useState(false) // feuille des urgences ouverte ?

  return (
    <AppShell className="items-center">
      {/* --- En-tete : menu + localisation + cloche (notifications) --- */}
      <HomeHeader alertCount={4} />

      {/* --- Logo agrandi (le nom est deja dans l'image) --- */}
      <header className="mt-4 flex w-full flex-col items-center">
        <BrandLogo size={190} priority />
      </header>

      {/* --- Zone centrale : bouton d'urgence --- */}
      <div className="flex flex-1 flex-col items-center justify-center py-6">
        <HelpButton onClick={() => setSheetOpen(true)} />

        <p className="mt-8 max-w-[17rem] text-balance text-center text-sm leading-relaxed text-muted-foreground">
          {t.home.instruction}
        </p>
      </div>

      {/* --- Bandeau de reassurance (2 indicateurs) --- */}
      <div className="grid w-full grid-cols-2 gap-3">
        <div className="card-premium flex items-center gap-3 p-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
            <Users className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold text-foreground">24</p>
            <p className="text-xs text-muted-foreground">{t.home.neighbors}</p>
          </div>
        </div>
        <div className="card-premium flex items-center gap-3 p-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/15 text-coral">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            {/* dir=ltr : "< 2 min" garde le bon sens meme en arabe */}
            <p dir="ltr" className="font-display text-lg font-semibold text-foreground">
              &lt; 2 min
            </p>
            <p className="text-xs text-muted-foreground">{t.home.responseTime}</p>
          </div>
        </div>
      </div>

      {/* --- Appel rapide POLICE (permanent, un clic) --- */}
      <div className="mt-3 w-full">
        <PoliceQuickCall />
      </div>

      {/* --- Feuille des 6 types d'urgence (modale du bas) --- */}
      <EmergencySheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </AppShell>
  )
}
