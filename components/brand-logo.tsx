/* ============================================================================
   brand-logo.tsx — LOGO OFFICIEL "Rijal Lghayth" presente comme un badge
   ----------------------------------------------------------------------------
   Le logo fourni est une image (avec son propre fond clair) qui contient DEJA
   le nom + le slogan. On ne re-ecrit donc AUCUN texte a cote.
   Pour l'integrer proprement sur le theme sombre, on le pose dans un cadre
   arrondi doux (effet "pastille de marque") -> rendu intentionnel et premium.
   ============================================================================ */

import Image from 'next/image'
import { cn } from '@/lib/utils'

export function BrandLogo({
  size = 96,
  className,
}: {
  /** Taille (px) du badge carre du logo */
  size?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        // Pastille claire arrondie : met le logo en valeur sur fond sombre
        'inline-flex items-center justify-center overflow-hidden rounded-3xl bg-white/95 p-2 ring-1 ring-white/10',
        'shadow-[0_18px_45px_-18px_rgba(0,0,0,0.8)]',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.jpeg"
        alt="Rijal Lghayth — Entraide, Proximité, Sécurité"
        width={size * 2}
        height={size * 2}
        priority
        className="h-full w-full rounded-2xl object-contain"
      />
    </div>
  )
}
