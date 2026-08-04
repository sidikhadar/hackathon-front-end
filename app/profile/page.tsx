/* ============================================================================
   app/profile/page.tsx — PROFIL UTILISATEUR (modifiable)
   ----------------------------------------------------------------------------
   Accessible depuis le menu lateral. Affiche :
     - photo + nom + "membre depuis"
     - infos (telephone, quartier)          -> MODIFIABLES
     - contact d'urgence enregistre          -> MODIFIABLE
     - score de reputation DISCRET et non alarmant (barre + libelle positif)
     - bouton "Signaler un abus" (ouvre une modale de confirmation)
   Bouton "Modifier" -> passe en mode edition (champs), puis Enregistrer/Annuler.
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
  Pencil,
  Check,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { AuthTopBar } from '@/components/auth-topbar'
import { useLanguage } from '@/lib/i18n'

/* Donnees utilisateur simulees (front seulement) */
type ProfileData = {
  name: string
  phone: string
  neighborhood: string
  emergencyName: string
  emergencyPhone: string
}

const INITIAL: ProfileData = {
  name: 'Sidi Mohamed',
  phone: '+222 44 22 11 00',
  neighborhood: 'Tevragh-Zeina, Nouakchott',
  emergencyName: 'Fatimetou (sœur)',
  emergencyPhone: '+222 22 33 44 55',
}

const STATIC = {
  photo: '/victims/sidi.png',
  memberSince: '2025',
  reputation: 92, // sur 100 — affiche de facon discrete
  helped: 12,
  alerts: 3,
}

export default function ProfilePage() {
  const router = useRouter()
  const { t } = useLanguage()

  const [data, setData] = useState<ProfileData>(INITIAL)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<ProfileData>(INITIAL)
  const [savedToast, setSavedToast] = useState(false)

  const [reportOpen, setReportOpen] = useState(false)
  const [reportSent, setReportSent] = useState(false)

  function startEdit() {
    setDraft(data)
    setEditing(true)
  }
  function cancelEdit() {
    setEditing(false)
  }
  function saveEdit() {
    setData(draft)
    setEditing(false)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 1800)
  }
  function set<K extends keyof ProfileData>(key: K, value: string) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

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

      <header className="mt-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {t.profile.title}
        </h1>
        {!editing && (
          <button
            type="button"
            onClick={startEdit}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition-colors active:bg-secondary/60"
          >
            <Pencil className="h-4 w-4" />
            {t.profile.edit}
          </button>
        )}
      </header>

      {/* --- Carte identite : photo + nom + membre depuis --- */}
      <section className="card-premium mt-6 flex flex-col items-center rounded-3xl p-6 text-center">
        <div className="relative">
          <Image
            src={STATIC.photo || '/placeholder.svg'}
            alt={data.name}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover ring-2 ring-coral/30"
          />
          {editing && (
            <button
              type="button"
              aria-label={t.profile.editPhoto}
              className="absolute -bottom-1 end-0 flex h-8 w-8 items-center justify-center rounded-full bg-coral text-primary-foreground shadow-md transition-transform active:scale-95"
            >
              <Camera className="h-4 w-4" />
            </button>
          )}
        </div>

        {editing ? (
          <div className="mt-4 w-full text-start">
            <FieldLabel>{t.profile.nameLabel}</FieldLabel>
            <TextField
              value={draft.name}
              onChange={(v) => set('name', v)}
              placeholder={t.profile.nameLabel}
            />
          </div>
        ) : (
          <>
            <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
              {data.name}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {t.profile.memberSince} {STATIC.memberSince}
            </p>
          </>
        )}

        {/* Deux petites stats d'entraide (positives) — masquees en edition */}
        {!editing && (
          <div className="mt-5 flex w-full gap-3">
            <div className="flex-1 rounded-2xl bg-secondary/60 p-3">
              <p className="font-display text-2xl font-semibold text-foreground">
                {STATIC.helped}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.profile.statHelped}
              </p>
            </div>
            <div className="flex-1 rounded-2xl bg-secondary/60 p-3">
              <p className="font-display text-2xl font-semibold text-foreground">
                {STATIC.alerts}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.profile.statAlerts}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* --- Infos de contact --- */}
      {editing ? (
        <section className="card-premium mt-4 flex flex-col gap-4 rounded-3xl p-5">
          <div>
            <FieldLabel>{t.profile.phoneLabel}</FieldLabel>
            <TextField
              value={draft.phone}
              onChange={(v) => set('phone', v)}
              type="tel"
              dir="ltr"
            />
          </div>
          <div>
            <FieldLabel>{t.profile.neighborhoodLabel}</FieldLabel>
            <TextField
              value={draft.neighborhood}
              onChange={(v) => set('neighborhood', v)}
            />
          </div>
        </section>
      ) : (
        <section className="card-premium mt-4 flex flex-col rounded-3xl p-2">
          <InfoRow
            icon={<Phone className="h-5 w-5" />}
            label={t.profile.phoneLabel}
            value={data.phone}
            ltr
          />
          <div className="mx-4 h-px bg-border" />
          <InfoRow
            icon={<MapPin className="h-5 w-5" />}
            label={t.profile.neighborhoodLabel}
            value={data.neighborhood}
          />
        </section>
      )}

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

        {editing ? (
          <div className="mt-3 flex flex-col gap-4">
            <div>
              <FieldLabel>{t.profile.emergencyNameLabel}</FieldLabel>
              <TextField
                value={draft.emergencyName}
                onChange={(v) => set('emergencyName', v)}
              />
            </div>
            <div>
              <FieldLabel>{t.profile.emergencyPhoneLabel}</FieldLabel>
              <TextField
                value={draft.emergencyPhone}
                onChange={(v) => set('emergencyPhone', v)}
                type="tel"
                dir="ltr"
              />
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-secondary/60 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {data.emergencyName}
              </p>
              <p dir="ltr" className="truncate text-sm text-muted-foreground">
                {data.emergencyPhone}
              </p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral">
              <Phone className="h-5 w-5" />
            </span>
          </div>
        )}
      </section>

      {/* --- Reputation (DISCRETE, non alarmante) — masquee en edition --- */}
      {!editing && (
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
              style={{ width: `${STATIC.reputation}%` }}
            />
          </div>
        </section>
      )}

      {/* --- Barre d'actions edition : Enregistrer / Annuler --- */}
      {editing ? (
        <div className="mt-6 mb-6 flex gap-3">
          <button
            type="button"
            onClick={cancelEdit}
            className="h-12 flex-1 rounded-2xl bg-secondary text-sm font-semibold text-foreground transition-colors active:bg-secondary/60"
          >
            {t.profile.cancelEdit}
          </button>
          <button
            type="button"
            onClick={saveEdit}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-coral text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            <Check className="h-4 w-4" />
            {t.profile.save}
          </button>
        </div>
      ) : (
        /* --- Signaler un abus (seulement hors edition) --- */
        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="mt-4 mb-6 flex items-center justify-center gap-2 rounded-2xl border border-border py-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Flag className="h-4 w-4" />
          {t.profile.report}
        </button>
      )}

      {/* --- Toast "Profil mis a jour" --- */}
      {savedToast && (
        <div className="fixed inset-x-0 bottom-6 z-[70] flex justify-center px-6 motion-safe:animate-in motion-safe:slide-in-from-bottom-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-success px-5 py-3 text-sm font-semibold text-white shadow-lg">
            <CheckCircle2 className="h-5 w-5" />
            {t.profile.saved}
          </div>
        </div>
      )}

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

/* --- Petit label de champ --- */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block px-1 text-xs font-medium text-muted-foreground">
      {children}
    </label>
  )
}

/* --- Champ texte custom (16px min pour eviter le zoom iOS) --- */
function TextField({
  value,
  onChange,
  placeholder,
  type = 'text',
  dir,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  dir?: 'ltr' | 'rtl'
}) {
  return (
    <input
      type={type}
      dir={dir}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-xl border border-border bg-secondary/40 px-4 text-base text-foreground outline-none transition-colors focus:border-coral focus:bg-secondary/60"
    />
  )
}

/* Ligne d'info reutilisable (icone + label + valeur) */
function InfoRow({
  icon,
  label,
  value,
  ltr,
}: {
  icon: React.ReactNode
  label: string
  value: string
  ltr?: boolean
}) {
  return (
    <div className="flex items-center gap-3 p-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          dir={ltr ? 'ltr' : undefined}
          className="truncate text-sm font-semibold text-foreground"
        >
          {value}
        </p>
      </div>
    </div>
  )
}
