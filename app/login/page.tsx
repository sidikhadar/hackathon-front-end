/* ============================================================================
   app/login/page.tsx — ECRAN 2 : CONNEXION (2 etapes)
   ----------------------------------------------------------------------------
   Etape 1 : saisie du numero de telephone (indicatif +222 fixe)
   Etape 2 : saisie du code OTP a 6 chiffres (avec compte a rebours de renvoi)
   NB : logique simulee (aucun vrai SMS). Le back-end Supabase sera branche
   plus tard. La validation reussie redirige vers l'accueil.
   ============================================================================ */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BrandLogo } from '@/components/brand-logo'
import { Field } from '@/components/field'
import { OtpInput } from '@/components/otp-input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()

  // Etape courante : 'phone' (numero) ou 'otp' (code)
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [seconds, setSeconds] = useState(0) // compte a rebours de renvoi

  // Decremente le compte a rebours chaque seconde (renvoi du code)
  useEffect(() => {
    if (seconds <= 0) return
    const t = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [seconds])

  // Etape 1 -> 2 : "envoi" simule du code
  function handleSendCode() {
    if (phone.replace(/\D/g, '').length < 8) return
    setStep('otp')
    setSeconds(30)
  }

  // Etape 2 : validation simulee -> accueil
  function handleVerify() {
    if (code.length < 6) return
    router.push('/')
  }

  return (
    <AppShell>
      {/* --- Barre de navigation haute --- */}
      <div className="flex items-center">
        <button
          onClick={() => (step === 'otp' ? setStep('phone') : router.push('/'))}
          aria-label="Retour"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* --- En-tete : logo + titre selon l'etape --- */}
      <header className="mt-6 flex flex-col items-center text-center">
        <BrandLogo size={96} priority />
        <h1 className="mt-6 text-balance font-display text-3xl font-semibold text-foreground">
          {step === 'phone' ? 'Bon retour' : 'Vérification'}
        </h1>
        <p className="mt-2 max-w-[18rem] text-pretty text-sm leading-relaxed text-muted-foreground">
          {step === 'phone'
            ? 'Connectez-vous avec votre numéro de téléphone.'
            : `Entrez le code à 6 chiffres envoyé au +222 ${phone}.`}
        </p>
      </header>

      {/* --- Corps du formulaire --- */}
      <div className="mt-8 flex flex-1 flex-col">
        {step === 'phone' ? (
          /* ---------- ETAPE 1 : numero de telephone ---------- */
          <div className="flex flex-col gap-5">
            <Field
              label="Numéro de téléphone"
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
              Recevoir le code
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
                  Renvoyer le code dans{' '}
                  <span className="font-semibold text-foreground">{seconds}s</span>
                </span>
              ) : (
                <button
                  onClick={() => setSeconds(30)}
                  className="font-semibold text-coral underline-offset-4 hover:underline"
                >
                  Renvoyer le code
                </button>
              )}
            </div>

            <Button
              size="lg"
              onClick={handleVerify}
              disabled={code.length < 6}
              className="h-14 rounded-2xl bg-coral text-base font-semibold text-primary-foreground hover:bg-coral/90 disabled:opacity-40"
            >
              Vérifier et continuer
            </Button>
          </div>
        )}
      </div>

      {/* --- Bas de page : lien inscription + note de securite --- */}
      <footer className="mt-6 flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Pas encore de compte ?{' '}
          <Link
            href="/register"
            className="font-semibold text-coral underline-offset-4 hover:underline"
          >
            Créer un compte
          </Link>
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          Vos données restent confidentielles
        </p>
      </footer>
    </AppShell>
  )
}
