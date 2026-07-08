/* ============================================================================
   app/page.tsx — ECRAN 1 : ACCUEIL
   ----------------------------------------------------------------------------
   Ecran central de l'app. Contient :
     - le logo officiel (sans texte duplique)
     - une pastille de localisation (contexte Nouakchott)
     - le BOUTON SIGNATURE "AIDE" (halo pulsant) au centre
     - au clic : ouverture de la feuille des 6 types d'urgence
     - un bandeau de reassurance + acces Connexion / Inscription
   ============================================================================ */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, ShieldCheck, Users } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BrandLogo } from '@/components/brand-logo'
import { HelpButton } from '@/components/help-button'
import { EmergencySheet } from '@/components/emergency-sheet'

export default function HomePage() {
  // Etat d'ouverture de la feuille des types d'urgence
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <AppShell className="items-center">
      {/* --- En-tete : logo seul (le nom est deja dans l'image) --- */}
      <header className="flex w-full flex-col items-center pt-2">
        <BrandLogo size={150} priority />

        {/* Localisation active (contexte : Nouakchott) */}
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-coral" />
          Tevragh-Zeina, Nouakchott
        </div>
      </header>

      {/* --- Zone centrale : bouton d'urgence --- */}
      <div className="flex flex-1 flex-col items-center justify-center py-8">
        <HelpButton onClick={() => setSheetOpen(true)} />

        <p className="mt-8 max-w-[16rem] text-balance text-center text-sm leading-relaxed text-muted-foreground">
          En cas de danger, appuyez. Vos voisins proches seront alertés
          <span className="text-foreground"> immédiatement</span>.
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
            <p className="text-xs text-muted-foreground">voisins actifs</p>
          </div>
        </div>
        <div className="card-premium flex items-center gap-3 p-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/15 text-coral">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold text-foreground">
              &lt; 2 min
            </p>
            <p className="text-xs text-muted-foreground">temps de réponse</p>
          </div>
        </div>
      </div>

      {/* --- Pied de page : acces connexion / inscription --- */}
      <footer className="mt-5 flex w-full items-center justify-center gap-1 text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Se connecter
        </Link>
        <span aria-hidden>·</span>
        <Link
          href="/register"
          className="font-medium text-coral underline-offset-4 hover:underline"
        >
          Créer un compte
        </Link>
      </footer>

      {/* --- Feuille des 6 types d'urgence (modale du bas) --- */}
      <EmergencySheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </AppShell>
  )
}
