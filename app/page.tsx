/* ============================================================================
   page.tsx — PAGE TEMPORAIRE (écran de démarrage / vitrine du design system)
   ----------------------------------------------------------------------------
   NOTE : Cette page est un simple aperçu pour vérifier que le design system
   fonctionne (logo, couleurs, polices, bouton pulsant). Elle sera remplacée
   par la vraie page d'Accueil quand tu m'enverras ton premier prompt.

   Choix de design :
     - On affiche UNIQUEMENT le logo (il contient déjà le nom + le slogan).
     - Le logo ayant un fond clair, on le pose dans un cadre clair arrondi
       "intentionnel" (halo doux) pour qu'il paraisse net et non pas comme
       un carré blanc posé au hasard sur le fond sombre #0F1418.
   ============================================================================ */

import Image from 'next/image'

export default function Page() {
  return (
    <main className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center gap-14 overflow-hidden px-6 py-12">
      {/* Halo décoratif très subtil derrière le contenu (ambiance, non intrusif) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 -z-10 size-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      {/* -------- Logo officiel SEUL (le texte est déjà dans l'image) -------- */}
      <div className="flex flex-col items-center">
        <div className="rounded-[2rem] bg-white p-4 shadow-2xl ring-1 ring-white/10">
          <Image
            src="/logo.jpeg"
            alt="Rijal Lghayth — Entraide, Proximité, Sécurité"
            width={200}
            height={200}
            priority
            className="size-40 rounded-2xl object-contain"
          />
        </div>
      </div>

      {/* -------- Bouton principal avec halo pulsant (signature de l'app) -------- */}
      <button
        type="button"
        aria-label="Demander de l'aide"
        className="flex size-44 flex-col items-center justify-center gap-1 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-200 animate-pulse-ring active:scale-95"
      >
        <span className="font-display text-3xl font-semibold uppercase tracking-wide">
          Aide
        </span>
        <span className="text-xs font-medium opacity-80">Appuyer</span>
      </button>

      {/* -------- Aperçu de la palette de couleurs -------- */}
      <div className="grid w-full grid-cols-3 gap-3">
        <ColorSwatch label="Corail" className="bg-primary text-primary-foreground" />
        <ColorSwatch label="Menthe" className="bg-success text-success-foreground" />
        <ColorSwatch label="Carte" className="border border-border bg-card text-card-foreground" />
      </div>

      <p className="text-center text-xs text-muted-foreground text-balance">
        Design system prêt. Envoie-moi ton premier prompt pour construire la page 1.
      </p>
    </main>
  )
}

/* Petit composant local : une pastille de couleur avec son étiquette */
function ColorSwatch({ label, className }: { label: string; className: string }) {
  return (
    <div className={`flex h-20 items-end rounded-xl p-3 text-xs font-medium ${className}`}>
      {label}
    </div>
  )
}
