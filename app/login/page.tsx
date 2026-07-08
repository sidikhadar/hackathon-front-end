/* ============================================================================
   app/login/page.tsx — ECRAN CONNEXION
   ----------------------------------------------------------------------------
   DEUX facons de se connecter :
     A) Mot de passe : telephone (+222) + mot de passe -> "Se connecter"
     B) Code SMS     : bouton "Recevoir un code par SMS" -> ECRAN SEPARE (OTP)
                       ou l'on saisit le code a 6 chiffres.
   En-tete identique a l'inscription (embleme + titre + Retour), SANS selecteur
   de langue ni bouton Aide (la langue se choisit uniquement sur l'accueil).
   Connexion reussie -> redirection vers l'accueil connecte /home.
   NB : logique simulee (aucun vrai SMS / mot de passe verifie).
   ============================================================================ */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, MessageSquare, Phone, ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { AuthTopBar } from '@/components/auth-topbar'
import { Field } from '@/components/field'
import { OtpInput } from '@/components/otp-input'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage() // textes traduits

  // Etape courante : 'form' (telephone + mot de passe) ou 'otp' (code SMS)
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [seconds, setSeconds] = useState(0) // compte a rebours de renvoi

  // Decremente le compte a rebours chaque seconde (renvoi du code)
  useEffect(() => {
    if (seconds <= 0) return
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [seconds])

  // Connexion par mot de passe (simulee) -> accueil connecte
  function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    router.push('/home')
  }

  // Bascule vers l'ecran SEPARE de saisie du code SMS
  function handleSendCode() {
    if (phone.replace(/\D/g, '').length < 8) return
    setStep('otp')
    setSeconds(30)
  }

  // Validation du code (simulee) -> accueil connecte
  function handleVerify() {
    if (code.length < 6) return
    router.push('/home')
  }

  // Retour : depuis l'OTP on revient au formulaire, sinon vers Welcome
  function handleBack() {
    if (step === 'otp') setStep('form')
    else router.push('/')
  }

  return (
    <AppShell>
      {/* --- En-tete : embleme + titre + Retour --- */}
      <AuthTopBar onBack={handleBack} />

      {/* --- Titre de l'ecran (selon l'etape) --- */}
      <header className="mt-8">
        <h1 className="text-balance font-display text-3xl font-semibold text-foreground">
          {step === 'form' ? t.login.titlePhone : t.login.titleOtp}
        </h1>
        <p className="mt-2 max-w-[20rem] text-pretty text-sm leading-relaxed text-muted-foreground">
          {step === 'form' ? (
            t.login.subtitlePhone
          ) : (
            <>
              {t.login.subtitleOtp}{' '}
              {/* Numero toujours en LTR (chiffres non inverses en arabe) */}
              <span dir="ltr" className="font-semibold text-foreground">
                +222 {phone}
              </span>
            </>
          )}
        </p>
      </header>

      {step === 'form' ? (
        /* ================= FORMULAIRE : telephone + mot de passe ================= */
        <form onSubmit={handlePasswordLogin} className="mt-8 flex flex-1 flex-col">
          <div className="flex flex-col gap-5">
            <Field
              label={t.login.phoneLabel}
              icon={<Phone className="h-5 w-5" />}
              prefix="+222"
              type="tel"
              inputMode="tel"
              placeholder="42 00 00 00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <div className="flex flex-col gap-2">
              <Field
                label={t.login.passwordLabel}
                icon={<Lock className="h-5 w-5" />}
                type="password"
                placeholder={t.login.passwordPlaceholder}
                autoComplete="current-password"
                required
              />
              {/* Lien "mot de passe oublie" aligne cote fin */}
              <Link
                href="#"
                className="self-end text-sm font-medium text-coral underline-offset-4 hover:underline"
              >
                {t.login.forgot}
              </Link>
            </div>
          </div>

          {/* --- Zone de boutons (poussee en bas de l'ecran) --- */}
          <div className="mt-auto flex flex-col gap-4 pt-8">
            {/* Bouton PRINCIPAL : se connecter avec mot de passe */}
            <Button
              type="submit"
              size="lg"
              className="h-14 rounded-2xl bg-coral text-base font-semibold text-primary-foreground hover:bg-coral/90"
            >
              {t.common.login}
            </Button>

            {/* Separateur "ou" */}
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {t.login.or}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            {/* Bouton SECONDAIRE : recevoir un code par SMS (ecran separe) */}
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={handleSendCode}
              className="h-14 rounded-2xl border-border bg-secondary/40 text-base font-semibold text-foreground hover:bg-secondary"
            >
              <MessageSquare className="mr-1 h-5 w-5" />
              {t.login.sendCode}
            </Button>

            {/* Lien vers l'inscription */}
            <p className="text-center text-sm text-muted-foreground">
              {t.login.noAccount}{' '}
              <Link
                href="/register"
                className="font-semibold text-coral underline-offset-4 hover:underline"
              >
                {t.common.register}
              </Link>
            </p>
          </div>
        </form>
      ) : (
        /* ================= ECRAN SEPARE : saisie du code SMS ================= */
        <div className="mt-8 flex flex-1 flex-col">
          <OtpInput value={code} onChange={setCode} />

          {/* Renvoi du code : desactive tant que le compte a rebours tourne */}
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
              disabled={code.length < 6}
              className="h-14 w-full rounded-2xl bg-coral text-base font-semibold text-primary-foreground hover:bg-coral/90 disabled:opacity-40"
            >
              {t.login.verify}
            </Button>
          </div>
        </div>
      )}

      {/* --- Note de securite en bas --- */}
      <footer className="mt-6 flex justify-center">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          {t.welcome.secure}
        </p>
      </footer>
    </AppShell>
  )
}
