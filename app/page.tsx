/* ============================================================================
   page.tsx — PAGE TEMPORAIRE (écran de démarrage / vitrine du design system)
   ----------------------------------------------------------------------------
   NOTE : Cette page est un simple aperçu pour vérifier que le design system
   fonctionne (logo, couleurs, polices, bouton pulsant). Elle sera remplacée
   par la vraie page d'Accueil quand tu m'enverras ton premier prompt.
   ============================================================================ */

import Image from 'next/image'

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-10 px-6 py-12">
      {/* -------- Logo officiel + slogan -------- */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-28 items-center justify-center overflow-hidden rounded-3xl bg-card ring-1 ring-border">
          <Image
            src="/logo.jpeg"
            alt="Logo Rijal Lghayth : écusson d'entraide de quartier"
            width={112}
            height={112}
            priority
            className="size-full object-cover"
          />
        </div>
        <h1 className="text-4xl font-semibold uppercase tracking-tight text-balance">
          Rijal Lghayth
        </h1>
        {/* Slogan du logo, avec les 3 couleurs de la marque */}
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Entraide <span className="text-success">·</span> Proximité{' '}
          <span className="text-primary">·</span> Sécurité
        </p>
      </div>

      {/* -------- Bouton principal avec halo pulsant (signature de l'app) -------- */}
      <button
        type="button"
        className="flex size-40 flex-col items-center justify-center gap-1 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-200 animate-pulse-ring active:scale-95"
      >
        <span className="font-display text-2xl font-semibold uppercase">Aide</span>
        <span className="text-xs font-medium opacity-80">Appuyer</span>
      </button>

      {/* -------- Aperçu de la palette de couleurs -------- */}
      <div className="grid w-full grid-cols-3 gap-3">
        <ColorSwatch label="Corail" className="bg-primary text-primary-foreground" />
        <ColorSwatch label="Menthe" className="bg-success text-success-foreground" />
        <ColorSwatch label="Carte" className="border border-border bg-card text-card-foreground" />
      </div>

      <p className="text-center text-xs text-muted-foreground">
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
