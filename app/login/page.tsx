/* ============================================================================
   app/login/page.tsx — ECRAN CONNEXION (2 etapes) + verification OTP
   ----------------------------------------------------------------------------
   Etape 1 : saisie du numero de telephone (indicatif +222 fixe)
   Etape 2 : saisie du code OTP a 6 chiffres (avec compte a rebours de renvoi)
   Nouveautes de cette version :
     - Barre haute avec selecteur de langue (FR/AR) + bouton "Aide"
     - Logo DISCRET en haut (petit), plus centre en heros
     - Tous les textes traduits (FR / AR + RTL)
     - Connexion reussie -> redirection vers l'accueil /home
   NB : logique simulee (aucun vrai SMS). Le back-end sera branche plus tard.
   ============================================================================ */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Phone, ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BrandLogo } from '@/components/brand-logo'
import { AuthTopBar } from '@/components/auth-topbar'
import { Field } from '@/components/field'
import { OtpInput } from '@/components/otp-input'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage() // textes traduits

  // Etape courante : 'phone' (numero) ou 'otp' (code)
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [seconds, setSeconds] = useState(0) // compte a rebours de renvoi

  // Decremente le compte a rebours chaque seconde (renvoi du code)
  useEffect(() => {
    if (seconds <= 0) return
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [seconds])

  // Etape 1 -> 2 : "envoi" simule du code
  function handleSendCode() {
    if (phone.replace(/\D/g, '').length < 8) return
    setStep('otp')
    setSeconds(30)
  }

  // Etape 2 : validation simulee -> accueil connecte
  function handleVerify() {
    if (code.length < 6) return
    router.push('/home')
  }

  // Bouton retour : depuis l'OTP on revient au numero, sinon vers Welcome
  function handleBack() {
    if (step === 'otp') setStep('phone')
    else router.push('/')
  }

  return (
    <AppShell>
      {/* --- Barre haute : retour + langue + aide --- */}
      <AuthTopBar onBack={handleBack} />

      {/* --- En-tete : logo DISCRET (petit) + titre selon l'etape --- */}
      <header className="mt-8 flex flex-col items-start">
        <BrandLogo size={56} priority />
        <h1 className="mt-5 text-balance font-display text-3xl font-semibold text-foreground">
          {step === 'phone' ? t.login.titlePhone : t.login.titleOtp}
        </h1>
        <p className="mt-2 max-w-[20rem] text-pretty text-sm leading-relaxed text-muted-foreground">
          {step === 'phone' ? (
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

      {/* --- Corps du formulaire --- */}
      <div className="mt-8 flex flex-1 flex-col">
        {step === 'phone' ? (
          /* ---------- ETAPE 1 : numero de telephone ---------- */
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
            />
            <Button
              size="lg"
              onClick={handleSendCode}
              className="h-14 rounded-2xl bg-coral text-base font-semibold text-primary-foreground hover:bg-coral/90"
            >
              {t.login.sendCode}
            </Button>
          </div>
        ) : (
          /* ---------- ETAPE 2 : code OTP ---------- */
          <div className="flex flex-col gap-5">
            <OtpInput value={code} onChange={setCode} />

            {/* Renvoi du code : desactive tant que le compte a rebours tourne */}
            <div className="text-center text-sm text-muted-foreground">
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

            <Button
              size="lg"
              onClick={handleVerify}
              disabled={code.length < 6}
              className="h-14 rounded-2xl bg-coral text-base font-semibold text-primary-foreground hover:bg-coral/90 disabled:opacity-40"
            >
              {t.login.verify}
            </Button>
          </div>
        )}
      </div>

      {/* --- Bas de page : lien inscription + note de securite --- */}
      <footer className="mt-6 flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          {t.login.noAccount}{' '}
          <Link
            href="/register"
            className="font-semibold text-coral underline-offset-4 hover:underline"
          >
            {t.common.register}
          </Link>
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          {t.welcome.secure}
        </p>
      </footer>
    </AppShell>
  )
}
