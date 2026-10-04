/* ============================================================================
   app/register/page.tsx — ECRAN INSCRIPTION (formulaire + verification OTP)
   ----------------------------------------------------------------------------
   Etape 1 ('form') : photo optionnelle, nom, telephone, mot de passe,
                      contact d'urgence + APPEL RAPIDE POLICE (permanent).
   Etape 2 ('otp')  : verification du code a 6 chiffres (ecran separe).
   En-tete identique a la connexion (embleme + titre + Retour), SANS selecteur
   de langue ni bouton Aide.
   Inscription verifiee -> redirection vers l'accueil connecte /home.
   NB : logique simulee (aucun vrai SMS / stockage).
   ============================================================================ */

'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Camera, CheckCircle2, Loader2, Lock, LogIn, Phone, User, UserPlus, Users } from 'lucide-react'
import Image from 'next/image'
import { AppShell } from '@/components/app-shell'
import { AuthTopBar } from '@/components/auth-topbar'
import { Field } from '@/components/field'
import { OtpInput } from '@/components/otp-input'
import { PoliceQuickCall } from '@/components/police-quick-call'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage() // textes traduits
  const fileInput = useRef<HTMLInputElement>(null)

  // Etape courante : 'form' -> 'otp' -> 'success'
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form')
  const [photo, setPhoto] = useState<string | null>(null) // apercu photo (optionnel)
  const [phone, setPhone] = useState('') // pour l'affichage dans l'etape OTP
  const [code, setCode] = useState('')
  const [seconds, setSeconds] = useState(0)
  // Action en cours -> spinner sur le bouton concerne uniquement
  const [loading, setLoading] = useState<null | 'submit' | 'verify' | 'login'>(null)

  // Simule un court appel reseau avant d'executer l'action
  function simulate(key: 'submit' | 'verify' | 'login', action: () => void) {
    if (loading) return
    setLoading(key)
    setTimeout(() => {
      action()
      setLoading(null)
    }, 900)
  }

  // Compte a rebours du renvoi de code (etape OTP)
  useEffect(() => {
    if (seconds <= 0) return
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [seconds])

  // Quand l'utilisateur choisit une image -> apercu local
  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPhoto(URL.createObjectURL(file))
  }

  // Etape 1 -> 2 : on "envoie" le code de verification
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    simulate('submit', () => {
      setStep('otp')
      setSeconds(30)
    })
  }

  // Etape 2 : verification simulee -> carte de succes (etape 3)
  function handleVerify() {
    if (code.length < 6) return
    simulate('verify', () => setStep('success'))
  }

  // Retour : success -> Welcome, OTP -> formulaire, formulaire -> Welcome
  function handleBack() {
    if (step === 'otp') setStep('form')
    else router.push('/')
  }

  return (
    <AppShell>
      {/* --- En-tete : embleme + titre + Retour --- */}
      <AuthTopBar onBack={handleBack} />

      {/* --- Titre de l'ecran (cache sur l'etape de succes) --- */}
      {step !== 'success' && (
        <header className="mt-6">
          <h1 className="text-balance font-display text-3xl font-semibold text-foreground">
            {step === 'form' ? t.register.title : t.register.titleOtp}
          </h1>
          <p className="mt-2 max-w-[20rem] text-pretty text-sm leading-relaxed text-muted-foreground">
            {step === 'form' ? (
              t.register.subtitle
            ) : (
              <>
                {t.register.subtitleOtp}{' '}
                <span dir="ltr" className="font-semibold text-foreground">
                  +222 {phone}
                </span>
              </>
            )}
          </p>
        </header>
      )}

      {step === 'form' ? (
        /* ================= ETAPE 1 : FORMULAIRE ================= */
        <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col gap-5">
          {/* --- Photo de profil optionnelle (libelle affiche UNE seule fois) --- */}
          <div className="flex items-center gap-4 rounded-3xl border border-border bg-card/60 p-3.5">
            {/* Apercu / bouton rond cliquable */}
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-border bg-input transition-colors hover:border-coral/60"
              aria-label={t.register.addPhoto}
            >
              {photo ? (
                <Image
                  src={photo || '/placeholder.svg'}
                  alt=""
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="h-7 w-7 text-muted-foreground" />
              )}
              {/* Petit badge appareil photo */}
              <span className="absolute bottom-0 end-0 flex h-6 w-6 items-center justify-center rounded-full bg-coral text-primary-foreground ring-2 ring-card">
                <Camera className="h-3.5 w-3.5" />
              </span>
            </button>

            {/* Libelle (une fois) + badge "optionnelle" + bouton d'action */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {t.register.photo}
                </p>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {t.register.photoOptional}
                </span>
              </div>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="mt-1 text-sm font-medium text-coral underline-offset-4 hover:underline"
              >
                {photo ? t.register.changePhoto : t.register.addPhoto}
              </button>
            </div>

            {/* Champ fichier reel (masque) */}
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
          </div>

          {/* Nom complet */}
          <Field
            label={t.register.fullName}
            icon={<User className="h-5 w-5" />}
            placeholder={t.register.fullNamePlaceholder}
            autoComplete="name"
            required
          />

          {/* Telephone */}
          <Field
            label={t.register.phoneLabel}
            icon={<Phone className="h-5 w-5" />}
            prefix="+222"
            type="tel"
            inputMode="tel"
            placeholder="42 00 00 00"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          {/* Mot de passe (avec bouton oeil) */}
          <Field
            label={t.register.passwordLabel}
            icon={<Lock className="h-5 w-5" />}
            type="password"
            placeholder={t.register.passwordPlaceholder}
            autoComplete="new-password"
            required
          />

          {/* --- Bloc contact d'urgence (distinct visuellement) --- */}
          <div className="rounded-3xl border border-border bg-card/60 p-4">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/15 text-success">
                <Users className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-foreground">
                  {t.register.emergencyTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.register.emergencySubtitle}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Field
                label={t.register.contactName}
                icon={<User className="h-5 w-5" />}
                placeholder={t.register.contactNamePlaceholder}
                required
              />
              <Field
                label={t.register.contactPhone}
                icon={<Phone className="h-5 w-5" />}
                prefix="+222"
                type="tel"
                inputMode="tel"
                placeholder="42 00 00 00"
                required
              />
            </div>
          </div>

          {/* --- Appel rapide POLICE (permanent, un clic) --- */}
          <PoliceQuickCall />

          {/* Bouton de soumission + lien connexion (pousse en bas) */}
          <div className="mt-auto flex flex-col gap-4 pt-2">
            <Button
              type="submit"
              size="lg"
              disabled={loading !== null}
              aria-busy={loading === 'submit'}
              className="h-14 rounded-2xl bg-coral text-base font-semibold text-primary-foreground hover:bg-coral/90 disabled:opacity-100"
            >
              {loading === 'submit' ? (
                <Loader2 className="mr-1 h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <UserPlus className="mr-1 h-5 w-5" />
              )}
              {t.register.submit}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t.register.haveAccount}{' '}
              <Link
                href="/login"
                className="font-semibold text-coral underline-offset-4 hover:underline"
              >
                {t.common.login}
              </Link>
            </p>
          </div>
        </form>
      ) : step === 'otp' ? (
        /* ================= ETAPE 2 : VERIFICATION OTP (ecran separe) ================= */
        <div className="mt-8 flex flex-1 flex-col">
          <OtpInput value={code} onChange={setCode} />

          {/* Renvoi du code */}
          <div className="mt-5 text-center text-sm text-muted-foreground">
            {seconds > 0 ? (
              <span>
                {t.login.resendIn}{' '}
                <span dir="ltr" className="font-semibold text-foreground">
                  {seconds}s
                </span>
              </span>
            ) : (
              <button
                onClick={() => setSeconds(30)}
                className="font-semibold text-coral underline-offset-4 hover:underline"
              >
                {t.login.resend}
              </button>
            )}
          </div>

          <div className="mt-auto pt-8">
            <Button
              size="lg"
              onClick={handleVerify}
              disabled={code.length < 6 || loading !== null}
              aria-busy={loading === 'verify'}
              className={`h-14 w-full rounded-2xl bg-coral text-base font-semibold text-primary-foreground hover:bg-coral/90 ${
                loading === 'verify' ? 'disabled:opacity-100' : 'disabled:opacity-40'
              }`}
            >
              {loading === 'verify' && (
                <Loader2 className="mr-1 h-5 w-5 animate-spin" aria-hidden="true" />
              )}
              {t.register.verify}
            </Button>
          </div>
        </div>
      ) : (
        /* ================= ETAPE 3 : CARTE DE SUCCES ================= */
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          {/* Pastille verte + coche (animation d'apparition douce) */}
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-success text-primary-foreground shadow-[0_20px_50px_-15px_rgba(34,153,84,0.6)] motion-safe:animate-in motion-safe:zoom-in-75 motion-safe:duration-500">
            <CheckCircle2 className="h-12 w-12" strokeWidth={2.4} />
          </span>

          <h1 className="mt-8 text-balance font-display text-3xl font-semibold text-foreground">
            {t.register.successTitle}
          </h1>
          <p className="mt-2 text-pretty text-base text-muted-foreground">
            {t.register.successSubtitle}
          </p>

          {/* Aller vers la connexion */}
          <Button
            size="lg"
            onClick={() => simulate('login', () => router.push('/login'))}
            disabled={loading !== null}
            aria-busy={loading === 'login'}
            className="mt-10 h-14 w-full rounded-2xl bg-coral text-base font-semibold text-primary-foreground hover:bg-coral/90 disabled:opacity-100"
          >
            {loading === 'login' ? (
              <Loader2 className="mr-1 h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <LogIn className="mr-1 h-5 w-5" />
            )}
            {t.register.loginNow}
          </Button>
        </div>
      )}
    </AppShell>
  )
}
