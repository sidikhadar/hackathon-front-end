/* ============================================================================
   app/settings/page.tsx — PARAMETRES (placeholder)
   ----------------------------------------------------------------------------
   Accessible depuis le menu lateral de l'accueil. Contenu detaille a venir
   dans une prochaine etape ; pour l'instant un ecran "bientot disponible"
   avec le meme en-tete (embleme + titre + Retour).
   ============================================================================ */

'use client'

import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { AuthTopBar } from '@/components/auth-topbar'
import { useLanguage } from '@/lib/i18n'

export default function SettingsPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <AppShell>
      <AuthTopBar onBack={() => router.push('/home')} />

      <header className="mt-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {t.menu.settings}
        </h1>
      </header>

      {/* Etat "bientot disponible" centre */}
      <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <Settings className="h-8 w-8" />
        </span>
        <p className="mt-5 font-display text-lg font-semibold text-foreground">
          {t.placeholder.soon}
        </p>
        <p className="mt-1 max-w-[16rem] text-pretty text-sm text-muted-foreground">
          {t.placeholder.soonSub}
        </p>
      </div>
    </AppShell>
  )
}
