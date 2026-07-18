/* ============================================================================
   emblem.tsx — EMBLEME SEUL du logo (l'ecusson, SANS le texte)
   ----------------------------------------------------------------------------
   Sert dans l'en-tete des pages Connexion / Inscription : on affiche a gauche
   l'embleme (petite icone ronde) suivi du titre "Rijal Lghayth" ecrit a cote.
   L'image `emblem.png` a un fond transparent -> elle se pose proprement sur
   n'importe quel fond, ici dans une pastille arrondie discrete.
   ============================================================================ */

import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Emblem({
  size = 44,
  className,
  priority = false,
}: {
  /** Cote (px) de la pastille carree */
  size?: number
  className?: string
  priority?: boolean
}) {
  return (
    <span
      className={cn(
        // Pastille arrondie avec fin liesere lumineux ; l'image (icone d'app)
        // porte deja son propre fond, donc elle remplit toute la pastille.
        'inline-flex items-center justify-center overflow-hidden rounded-2xl ring-1 ring-white/10',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/emblem.png"
        alt="Rijal Lghayth"
        width={size * 2}
        height={size * 2}
        priority={priority}
        className="h-full w-full select-none object-cover"
      />
    </span>
  )
}
