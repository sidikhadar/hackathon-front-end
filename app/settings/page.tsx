/* ============================================================================
   app/settings/page.tsx — PARAMETRES
   ----------------------------------------------------------------------------
   Accessible depuis le menu lateral de l'accueil. Contient :
     - Preferences : langue, notifications, son, partage de position (toggles)
     - Aide & support : guide d'utilisation (modale), FAQ, contact
     - Legal : conditions d'utilisation, confidentialite
     - A propos : nom de l'app, version, developpe par HYBRIDS TECH
                  (fondateur : Sidi Mohamed El Khader)
   NB : le profil n'est PAS ici (il a sa propre page /profile via le menu).
   Les toggles/actions simulent le comportement (UI prioritaire).
   ============================================================================ */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  BookOpen,
  ChevronRight,
  FileText,
  HelpCircle,
  Mail,
  MapPin,
  Shield,
  Volume2,
  X,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { AuthTopBar } from '@/components/auth-topbar'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/* -- Petit interrupteur (toggle) custom, aligne sur le design system -- */
function Toggle({
  on,
  onToggle,
  label,
}: {
  on: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        'relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200',
        on ? 'bg-coral' : 'bg-secondary',
      )}
    >
      <span
        className={cn(
          'absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-200',
          on ? 'left-6' : 'left-1',
        )}
      />
    </button>
  )
}

/* -- Ligne de reglage generique (icone + libelle + action a droite) -- */
function Row({
  icon: Icon,
  label,
  sub,
  right,
  onClick,
}: {
  icon: typeof Bell
  label: string
  sub?: string
  right?: React.ReactNode
  onClick?: () => void
}) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-4 px-4 py-3.5 text-start',
        onClick && 'transition-colors active:bg-secondary/60',
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground">
          {label}
        </span>
        {sub && (
          <span className="truncate text-xs text-muted-foreground">{sub}</span>
        )}
      </span>
      {right}
    </Comp>
  )
}

/* -- Titre de section -- */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 mt-7 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h2>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const s = t.settings

  // Etats simules des preferences
  const [notif, setNotif] = useState(true)
  const [sound, setSound] = useState(true)
  const [location, setLocation] = useState(true)
  const [guideOpen, setGuideOpen] = useState(false)
  // Modale d'information (FAQ, conditions, confidentialite)
  const [info, setInfo] = useState<null | 'faq' | 'terms' | 'privacy'>(null)

  const guideSteps = [
    { title: s.guideStep1Title, body: s.guideStep1 },
    { title: s.guideStep2Title, body: s.guideStep2 },
    { title: s.guideStep3Title, body: s.guideStep3 },
    { title: s.guideStep4Title, body: s.guideStep4 },
  ]

  return (
    <AppShell>
      <AuthTopBar onBack={() => router.push('/home')} />

      <header className="mt-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {s.title}
        </h1>
      </header>

      <div className="pb-10">
        {/* ----- Preferences ----- */}
        <SectionTitle>{s.prefsTitle}</SectionTitle>
        <div className="card-premium divide-y divide-white/5 overflow-hidden rounded-2xl">
          <Row
            icon={MapPin}
            label={s.language}
            right={<LanguageSwitcher />}
          />
          <Row
            icon={Bell}
            label={s.notifications}
            sub={s.notificationsSub}
            right={
              <Toggle on={notif} onToggle={() => setNotif((v) => !v)} label={s.notifications} />
            }
          />
          <Row
            icon={Volume2}
            label={s.sound}
            sub={s.soundSub}
            right={
              <Toggle on={sound} onToggle={() => setSound((v) => !v)} label={s.sound} />
            }
          />
          <Row
            icon={MapPin}
            label={s.location}
            sub={s.locationSub}
            right={
              <Toggle
                on={location}
                onToggle={() => setLocation((v) => !v)}
                label={s.location}
              />
            }
          />
        </div>

        {/* ----- Aide & support ----- */}
        <SectionTitle>{s.helpTitle}</SectionTitle>
        <div className="card-premium divide-y divide-white/5 overflow-hidden rounded-2xl">
          <Row
            icon={BookOpen}
            label={s.guide}
            sub={s.guideSub}
            onClick={() => setGuideOpen(true)}
            right={<ChevronRight className="h-5 w-5 text-muted-foreground rtl:rotate-180" />}
          />
          <Row
            icon={HelpCircle}
            label={s.faq}
            onClick={() => setInfo('faq')}
            right={<ChevronRight className="h-5 w-5 text-muted-foreground rtl:rotate-180" />}
          />
          <Row
            icon={Mail}
            label={s.contact}
            sub={s.contactSub}
            onClick={() => {
              window.location.href = 'mailto:support@hybridstech.com'
            }}
            right={<ChevronRight className="h-5 w-5 text-muted-foreground rtl:rotate-180" />}
          />
        </div>

        {/* ----- Legal ----- */}
        <SectionTitle>{s.legalTitle}</SectionTitle>
        <div className="card-premium divide-y divide-white/5 overflow-hidden rounded-2xl">
          <Row
            icon={FileText}
            label={s.terms}
            onClick={() => setInfo('terms')}
            right={<ChevronRight className="h-5 w-5 text-muted-foreground rtl:rotate-180" />}
          />
          <Row
            icon={Shield}
            label={s.privacy}
            onClick={() => setInfo('privacy')}
            right={<ChevronRight className="h-5 w-5 text-muted-foreground rtl:rotate-180" />}
          />
        </div>

        {/* ----- A propos ----- */}
        <SectionTitle>{s.aboutTitle}</SectionTitle>
        <div className="card-premium rounded-2xl px-5 py-6 text-center">
          <p className="font-display text-lg font-semibold text-foreground">
            {s.appName}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{s.appVersion}</p>

          <div className="mx-auto my-4 h-px w-16 bg-white/10" />

          <p className="text-xs text-muted-foreground">{s.developedBy}</p>
          <p className="mt-1 font-display text-base font-semibold tracking-wide text-coral">
            {s.startup}
          </p>
          <p className="mt-1 text-sm text-foreground">{s.founder}</p>

          <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
            {s.rights}
          </p>
        </div>
      </div>

      {/* ===== Modale : Guide d'utilisation ===== */}
      {guideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={s.guideTitle}
          onClick={() => setGuideOpen(false)}
        >
          <div
            className="animate-in slide-in-from-bottom-4 fade-in max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-6 shadow-xl duration-300 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral/15 text-coral">
                  <BookOpen className="h-6 w-6" />
                </span>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {s.guideTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGuideOpen(false)}
                aria-label={s.close}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors active:bg-secondary/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
              {s.guideIntro}
            </p>

            <ol className="mt-5 flex flex-col gap-4">
              {guideSteps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {step.title}
                    </span>
                    <span className="mt-0.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </span>
                  </div>
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={() => setGuideOpen(false)}
              className="mt-6 h-12 w-full rounded-xl bg-coral font-semibold text-white transition-transform active:scale-[0.98]"
            >
              {s.close}
            </button>
          </div>
        </div>
      )}

      {/* ===== Modale : FAQ / Conditions / Confidentialite ===== */}
      {info && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={
            info === 'faq'
              ? s.faqTitle
              : info === 'terms'
                ? s.termsTitle
                : s.privacyTitle
          }
          onClick={() => setInfo(null)}
        >
          <div
            className="animate-in slide-in-from-bottom-4 fade-in max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-6 shadow-xl duration-300 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral/15 text-coral">
                  {info === 'faq' ? (
                    <HelpCircle className="h-6 w-6" />
                  ) : info === 'terms' ? (
                    <FileText className="h-6 w-6" />
                  ) : (
                    <Shield className="h-6 w-6" />
                  )}
                </span>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {info === 'faq'
                    ? s.faqTitle
                    : info === 'terms'
                      ? s.termsTitle
                      : s.privacyTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInfo(null)}
                aria-label={s.close}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors active:bg-secondary/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FAQ : questions / reponses */}
            {info === 'faq' && (
              <ul className="mt-5 flex flex-col gap-5">
                {s.faqItems.map((item, i) => (
                  <li key={i} className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-foreground">
                      {item.q}
                    </span>
                    <span className="text-pretty text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Conditions / Confidentialite : paragraphes */}
            {info !== 'faq' && (
              <div className="mt-5 flex flex-col gap-3.5">
                {(info === 'terms' ? s.termsBody : s.privacyBody).map(
                  (para, i) => (
                    <p
                      key={i}
                      className="text-pretty text-sm leading-relaxed text-muted-foreground"
                    >
                      {para}
                    </p>
                  ),
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setInfo(null)}
              className="mt-6 h-12 w-full rounded-xl bg-coral font-semibold text-white transition-transform active:scale-[0.98]"
            >
              {s.close}
            </button>
          </div>
        </div>
      )}
    </AppShell>
  )
}
