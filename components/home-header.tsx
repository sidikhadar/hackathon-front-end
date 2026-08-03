/* ============================================================================
   home-header.tsx — EN-TETE DE L'ACCUEIL CONNECTE
   ----------------------------------------------------------------------------
   Affiche (facon "tableau de bord") :
     - a gauche  : bouton MENU (hamburger) qui ouvre le tiroir lateral
     - au centre : la LOCALISATION de l'utilisateur (ex: Tevragh-Zeina)
     - a droite  : la CLOCHE de notifications (badge nombre) -> page /alerts
   Gere aussi :
     - le TIROIR LATERAL (logo + nom, Parametres, Historique, langue, deconnexion)
     - la MODALE de confirmation de deconnexion
   Tout s'adapte a la langue (FR / AR) et au sens de lecture (RTL en arabe).
   ============================================================================ */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  History,
  LogOut,
  MapPin,
  Menu,
  Settings,
  User,
  X,
} from 'lucide-react'
import { Emblem } from '@/components/emblem'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function HomeHeader({ alertCount = 4 }: { alertCount?: number }) {
  const router = useRouter()
  const { t, dir } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false) // tiroir lateral ouvert ?
  const [logoutOpen, setLogoutOpen] = useState(false) // modale de deconnexion ?

  // Fleche "vers l'interieur de l'item" selon le sens de lecture
  const ItemArrow = dir === 'rtl' ? ChevronLeft : ChevronRight

  // Items de navigation du tiroir
  const items = [
    {
      icon: User,
      label: t.menu.profile,
      sub: t.menu.profileSub,
      href: '/profile',
    },
    {
      icon: Settings,
      label: t.menu.settings,
      sub: t.menu.settingsSub,
      href: '/settings',
    },
    {
      icon: History,
      label: t.menu.history,
      sub: t.menu.historySub,
      href: '/history',
    },
  ]

  function go(href: string) {
    setMenuOpen(false)
    router.push(href)
  }

  return (
    <>
      {/* =================== BARRE D'EN-TETE =================== */}
      <header className="flex w-full items-center justify-between gap-3">
        {/* Bouton MENU (hamburger) */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label={t.menu.title}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition-colors hover:bg-secondary active:scale-95"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Localisation (au centre, tronquee si trop longue) */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5">
          <MapPin className="h-4 w-4 shrink-0 text-coral" />
          <span className="truncate text-sm font-semibold text-foreground">
            {t.home.location}
          </span>
        </div>

        {/* Cloche de notifications -> alertes des voisins */}
        <button
          type="button"
          onClick={() => router.push('/alerts')}
          aria-label={t.home.notifications}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition-colors hover:bg-secondary active:scale-95"
        >
          <Bell className="h-5 w-5" />
          {alertCount > 0 && (
            <span
              dir="ltr"
              className="absolute -top-1 end-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[11px] font-bold text-primary-foreground ring-2 ring-background"
            >
              {alertCount}
            </span>
          )}
        </button>
      </header>

      {/* =================== TIROIR LATERAL =================== */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Fond assombri (ferme au clic) */}
          <button
            type="button"
            aria-label={t.common.close}
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in"
          />

          {/* Panneau (glisse depuis le cote debut : gauche en FR, droite en AR) */}
          <aside
            className={cn(
              'absolute inset-y-0 start-0 flex w-[82%] max-w-[340px] flex-col bg-card shadow-2xl',
              'motion-safe:animate-in motion-safe:duration-300',
              dir === 'rtl'
                ? 'motion-safe:slide-in-from-right'
                : 'motion-safe:slide-in-from-left',
            )}
          >
            {/* En-tete du tiroir : embleme + nom + version + fermer */}
            <div className="flex items-center gap-3 border-b border-border p-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
              <Emblem size={46} />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate font-display text-lg font-semibold text-foreground">
                  {t.common.brand}
                </p>
                <p className="text-xs text-muted-foreground">{t.menu.version}</p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={t.common.close}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Liens de navigation */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {items.map(({ icon: Icon, label, sub, href }) => (
                <button
                  key={href}
                  type="button"
                  onClick={() => go(href)}
                  className="flex items-center gap-3 rounded-2xl p-3 text-start transition-colors hover:bg-secondary"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {label}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {sub}
                    </span>
                  </span>
                  <ItemArrow className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))}

              {/* Section langue */}
              <div className="mt-2 rounded-2xl bg-secondary/50 p-3">
                <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t.menu.language}
                </p>
                <LanguageSwitcher />
              </div>
            </nav>

            {/* Bas du tiroir : deconnexion */}
            <div className="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  setLogoutOpen(true)
                }}
                className="flex w-full items-center gap-3 rounded-2xl p-3 text-start text-destructive transition-colors hover:bg-destructive/10"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                  <LogOut className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold">{t.menu.logout}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* =================== MODALE DE DECONNEXION =================== */}
      {logoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          {/* Fond assombri */}
          <button
            type="button"
            aria-label={t.logout.cancel}
            onClick={() => setLogoutOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in"
          />

          {/* Carte de confirmation */}
          <div className="relative w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-2xl motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-200">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <LogOut className="h-8 w-8" />
            </span>
            <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
              {t.logout.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.logout.message}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="h-12 flex-1 rounded-2xl bg-secondary text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
              >
                {t.logout.cancel}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="h-12 flex-1 rounded-2xl bg-destructive text-sm font-semibold text-destructive-foreground transition-opacity hover:opacity-90"
              >
                {t.logout.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
