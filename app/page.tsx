/* ============================================================================
   page.tsx — PAGE TEMPORAIRE (écran de démarrage / vitrine du design system)
   ----------------------------------------------------------------------------
   NOTE : Cette page est un simple aperçu pour vérifier que le design system
   fonctionne (logo, couleurs, polices, bouton pulsant). Elle sera remplacée
   par la vraie page d'Accueil quand tu m'enverras ton prochain prompt.

   Choix de design (thème CLAIR premium) :
     - Fond blanc cassé #F6F8FA -> le logo (fond crème) s'intègre naturellement.
     - On affiche UNIQUEMENT le logo (il contient déjà le nom + le slogan).
     - Bouton d'urgence CORAIL #FF6B4A avec halo pulsant : élément signature.
   ============================================================================ */

import Image from 'next/image'

export default function Page() {
  return (
    <main className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-between overflow-hidden px-6 pb-12 pt-10">
      {/* Halo décoratif très subtil (ambiance douce, non intrusive) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 size-80 -translate-x-1/2 rounded-full bg-coral/5 blur-3xl"
      />

      {/* -------- Logo officiel SEUL (le texte est déjà dans l'image) -------- */}
      <div className="flex flex-col items-center pt-6">
        <Image
          src="/logo.jpeg"
          alt="Rijal Lghayth — Entraide, Proximité, Sécurité"
          width={220}
          height={220}
          priority
          className="size-48 object-contain"
        />
      </div>

      {/* -------- Bouton principal avec halo pulsant (signature de l'app) -------- */}
      <div className="flex flex-col items-center gap-5">
        <button
          type="button"
          aria-label="Demander de l'aide"
          className="flex size-48 flex-col items-center justify-center gap-1 rounded-full bg-coral text-coral-foreground shadow-xl shadow-coral/30 transition-transform duration-200 animate-pulse-ring active:scale-95"
        >
          <span className="font-display text-4xl font-semibold uppercase tracking-wide">
            Aide
          </span>
          <span className="text-xs font-medium uppercase tracking-widest opacity-90">
            Appuyer
          </span>
        </button>
        <p className="max-w-xs text-center text-sm text-muted-foreground text-pretty">
          En cas d&apos;urgence, appuyez pour alerter vos voisins proches.
        </p>
      </div>

      {/* -------- Aperçu de la palette (repère de dev, sera retiré) -------- */}
      <div className="grid w-full grid-cols-3 gap-3">
        <ColorSwatch label="Corail" className="bg-coral text-coral-foreground" />
        <ColorSwatch label="Menthe" className="bg-success text-success-foreground" />
        <ColorSwatch
          label="Marine"
          className="bg-primary text-primary-foreground"
        />
      </div>
    </main>
  )
}

/* Petit composant local : une pastille de couleur avec son étiquette */
function ColorSwatch({ label, className }: { label: string; className: string }) {
  return (
    <div
      className={`flex h-16 items-end rounded-xl p-3 text-xs font-medium shadow-sm ${className}`}
    >
      {label}
    </div>
  )
}
