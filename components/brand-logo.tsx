/* ============================================================================
   brand-logo.tsx — LOGO OFFICIEL "Rijal Lghayth"
   ----------------------------------------------------------------------------
   Le logo fourni est une image a FOND SOMBRE qui contient DEJA le nom + le
   slogan. On ne re-ecrit donc AUCUN texte a cote.
   Comme son fond est deja sombre, on l'affiche directement (object-contain)
   sans cadre ni pastille : il se fond naturellement dans le theme premium.
   ============================================================================ */

import Image from 'next/image'
import { cn } from '@/lib/utils'

export function BrandLogo({
  size = 200,
  className,
  priority = false,
}: {
  /** Largeur (px) du logo affiche */
  size?: number
  className?: string
  /** true sur l'ecran d'accueil pour un chargement prioritaire */
  priority?: boolean
}) {
  return (
    // Badge arrondi : le logo a un fond noir pur, on l'enveloppe dans un
    // conteneur arrondi (avec une fine bordure) pour un rendu "pastille"
    // intentionnel qui se fond dans le theme au lieu d'un carre visible.
    <div
      className={cn(
        'inline-flex items-center justify-center overflow-hidden rounded-3xl bg-black ring-1 ring-white/10',
        'shadow-[0_18px_45px_-20px_rgba(0,0,0,0.9)]',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.jpeg"
        alt="Rijal Lghayth — Entraide, Proximité, Sécurité"
        width={size * 2}
        height={size * 2}
        priority={priority}
        className="h-full w-full select-none object-cover"
      />
    </div>
  )
}
