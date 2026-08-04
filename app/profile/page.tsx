/* ============================================================================
   app/profile/page.tsx — PROFIL UTILISATEUR
   ----------------------------------------------------------------------------
   Accessible depuis le menu lateral. Affiche :
     - photo + nom + "membre depuis"
     - infos (telephone, quartier)
     - contact d'urgence enregistre
     - score de reputation DISCRET et non alarmant (barre + libelle positif)
     - bouton "Signaler un abus" (ouvre une modale de confirmation)
   Bilingue FR/AR avec support RTL. Coherent avec le design de l'app.
   ============================================================================ */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Phone,
  MapPin,
  ShieldCheck,
  Flag,
  Camera,
  HeartHandshake,
  Bell,
  CheckCircle2,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { AuthTopBar } from '@/components/auth-topbar'
import { useLanguage } from '@/lib/i18n'

/* Donnees utilisateur simulees (front seulement) */
const USER = {
  name: 'Sidi Mohamed',
  photo: '/victims/sidi.png',
  phone: '+222 44 22 11 00',
  neighborhood: 'Tevragh-Zeina, Nouakchott',
  memberSince: '2025',
  emergencyName: 'Fatimetou (sœur)',
  emergencyPhone: '+222 22 33 44 55',
  reputation: 92, // sur 100 — affiche de facon discrete
  helped: 12,
  alerts: 3,
}

export default function ProfilePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [reportOpen, setReportOpen] = useState(false)
  const [reportSent, setReportSent] = useState(false)

  function submitReport() {
    setReportSent(true)
    setTimeout(() => {
      setReportOpen(false)
      setReportSent(false)
    }, 1600)
  }

  return (
    <AppShell>
      <AuthTopBar onBack={() => router.push('/home')} />

      <header className="mt-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {t.profile.title}
        </h1>
      </header>

      {/* --- Carte identite : photo + nom + membre depuis --- */}
      <section className="card-premium mt-6 flex flex-col items-center rounded-3xl p-6 text-center">
        <div className="relative">
          <Image
            src={USER.photo || "/placeholder.svg"}
            alt={USER.name}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover ring-2 ring-coral/30"
          />
          <button
            type="button"
            aria-label={t.profile.editPhoto}
            className="absolute -bottom-1 end-0 flex h-8 w-8 items-center justify-center rounded-full bg-coral text-primary-foreground shadow-md transition-transform active:scale-95"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
          {USER.name}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t.profile.memberSince} {USER.memberSince}
        </p>

        {/* Deux petites stats d'entraide (positives) */}
        <div className="mt-5 flex w-full gap-3">
          <div className="flex-1 rounded-2xl bg-secondary/60 p-3">
            <p className="font-display text-2xl font-semibold text-foreground">
              {USER.helped}
            </p>
            <p className="text-xs text-muted-foreground">{t.profile.statHelped}</p>
          </div>
          <div className="flex-1 rounded-2xl bg-secondary/60 p-3">
            <p className="font-display text-2xl font-semibold text-foreground">
              {USER.alerts}
            </p>
            <p className="text-xs text-muted-foreground">{t.profile.statAlerts}</p>
          </div>
        </div>
      </section>

      {/* --- Infos de contact --- */}
      <section className="card-premium mt-4 flex flex-col rounded-3xl p-2">
        <InfoRow
          icon={<Phone className="h-5 w-5" />}
          label={t.profile.phoneLabel}
          value={USER.phone}
        />
        <div className="mx-4 h-px bg-border" />
        <InfoRow
          icon={<MapPin className="h-5 w-5" />}
          label={t.profile.neighborhoodLabel}
          value={USER.neighborhood}
        />
      </section>

      {/* --- Contact d'urgence enregistre --- */}
      <section className="card-premium mt-4 rounded-3xl p-5">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-coral" />
          <h3 className="font-display text-base font-semibold text-foreground">
            {t.profile.emergencyTitle}
          </h3>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {t.profile.emergencySub}
        </p>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-secondary/60 p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {USER.emergencyName}
            </p>
            <p dir="ltr" className="truncate text-sm text-muted-foreground">
              {USER.emergencyPhone}
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral">
            <Phone className="h-5 w-5" />
          </span>
        </div>
      </section>

      {/* --- Reputation (DISCRETE, non alarmante) --- */}
      <section className="card-premium mt-4 rounded-3xl p-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success/15 text-success">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-base font-semibold text-foreground">
              {t.profile.reputationTitle}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t.profile.reputationSub}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
            <HeartHandshake className="h-3.5 w-3.5" />
            {t.profile.reputationTrusted}
          </span>
        </div>

        {/* Barre douce, sans chiffre anxiogene mis en avant */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-success transition-all duration-700"
            style={{ width: `${USER.reputation}%` }}
          />
        </div>
      </section>

      {/* --- Signaler un abus --- */}
      <button
        type="button"
        onClick={() => setReportOpen(true)}
        className="mt-4 mb-6 flex items-center justify-center gap-2 rounded-2xl border border-border py-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Flag className="h-4 w-4" />
        {t.profile.report}
      </button>

      {/* =================== MODALE : SIGNALER UN ABUS =================== */}
      {reportOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <button
            type="button"
            aria-label={t.profile.cancel}
            onClick={() => !reportSent && setReportOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in"
          />
          <div className="relative w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-2xl motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-200">
            {reportSent ? (
              <>
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
                  {t.profile.reportSent}
                </h2>
              </>
            ) : (
              <>
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-coral/15 text-coral">
                  <Flag className="h-8 w-8" />
                </span>
                <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
                  {t.profile.reportTitle}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.profile.reportMsg}
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setReportOpen(false)}
                    className="h-12 flex-1 rounded-2xl bg-secondary text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
                  >
                    {t.profile.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={submitReport}
                    className="h-12 flex-1 rounded-2xl bg-coral text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {t.profile.reportConfirm}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AppShell>
  )
}

/* Ligne d'info reutilisable (icone + label + valeur) */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 p-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p dir={label === 'Téléphone' || label === 'الهاتف' ? 'ltr' : undefined} className="truncate text-sm font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}
