/* ============================================================================
   app/history/page.tsx — HISTORIQUE DES ALERTES (placeholder)
   ----------------------------------------------------------------------------
   Accessible depuis le menu lateral de l'accueil. Affichera plus tard la liste
   des alertes passees de l'utilisateur. Pour l'instant : "bientot disponible".
   ============================================================================ */

'use client'

import { useRouter } from 'next/navigation'
import { History } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { AuthTopBar } from '@/components/auth-topbar'
import { useLanguage } from '@/lib/i18n'

export default function HistoryPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <AppShell>
      <AuthTopBar onBack={() => router.push('/home')} />

      <header className="mt-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {t.menu.history}
        </h1>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <History className="h-8 w-8" />
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
