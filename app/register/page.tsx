/* ============================================================================
   app/register/page.tsx — ECRAN 3 : INSCRIPTION
   ----------------------------------------------------------------------------
   Formulaire de creation de compte :
     - Photo de profil OPTIONNELLE (aperçu local via URL.createObjectURL)
     - Nom complet
     - Numero de telephone (indicatif +222)
     - Contact d'urgence : nom + telephone (bloc distinct, entoure)
   NB : logique simulee. La validation redirige vers l'OTP de connexion.
   ============================================================================ */

'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Camera, Phone, User, UserPlus, Users } from 'lucide-react'
import Image from 'next/image'
import { AppShell } from '@/components/app-shell'
import { Field } from '@/components/field'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  const router = useRouter()
  const fileInput = useRef<HTMLInputElement>(null)

  // Aperçu local de la photo de profil (optionnelle)
  const [photo, setPhoto] = useState<string | null>(null)

  // Quand l'utilisateur choisit une image, on genere un aperçu local
  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPhoto(URL.createObjectURL(file))
  }

  // Soumission simulee -> on envoie vers la connexion (etape OTP)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push('/login')
  }

  return (
    <AppShell>
      {/* --- Navigation haute --- */}
      <div className="flex items-center">
        <button
          onClick={() => router.push('/')}
          aria-label="Retour"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* --- Titre --- */}
      <header className="mt-4">
        <h1 className="text-balance font-display text-3xl font-semibold text-foreground">
          Créer un compte
        </h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
          Rejoignez le réseau d'entraide de votre quartier.
        </p>
      </header>

      {/* --- Formulaire --- */}
      <form onSubmit={handleSubmit} className="mt-7 flex flex-1 flex-col gap-5">
        {/* Photo de profil optionnelle (bouton rond) */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-dashed border-border bg-card transition-colors hover:border-coral/60"
            aria-label="Ajouter une photo de profil"
          >
            {photo ? (
              <Image
                src={photo || '/placeholder.svg'}
                alt="Aperçu de la photo de profil"
                fill
                className="object-cover"
              />
            ) : (
              <User className="h-9 w-9 text-muted-foreground" />
            )}
            {/* Badge appareil photo */}
            <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-coral text-primary-foreground ring-4 ring-background">
              <Camera className="h-4 w-4" />
            </span>
          </button>
          <span className="text-xs text-muted-foreground">Photo (optionnelle)</span>
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
          label="Nom complet"
          icon={<User className="h-5 w-5" />}
          placeholder="Ahmed Ould Mohamed"
          autoComplete="name"
          required
        />

        {/* Telephone */}
        <Field
          label="Numéro de téléphone"
          icon={<Phone className="h-5 w-5" />}
          prefix="+222"
          type="tel"
          inputMode="tel"
          placeholder="42 00 00 00"
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
                Contact d'urgence
              </p>
              <p className="text-xs text-muted-foreground">
                Prévenu si vous lancez une alerte
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Field
              label="Nom du contact"
              icon={<User className="h-5 w-5" />}
              placeholder="Proche ou famille"
              required
            />
            <Field
              label="Téléphone du contact"
              icon={<Phone className="h-5 w-5" />}
              prefix="+222"
              type="tel"
              inputMode="tel"
              placeholder="42 00 00 00"
              required
            />
          </div>
        </div>

        {/* Bouton de soumission (pousse en bas) */}
        <div className="mt-auto flex flex-col gap-4 pt-2">
          <Button
            type="submit"
            size="lg"
            className="h-14 rounded-2xl bg-coral text-base font-semibold text-primary-foreground hover:bg-coral/90"
          >
            <UserPlus className="mr-1 h-5 w-5" />
            Créer mon compte
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Déjà inscrit ?{' '}
            <Link
              href="/login"
              className="font-semibold text-coral underline-offset-4 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </form>
    </AppShell>
  )
}
