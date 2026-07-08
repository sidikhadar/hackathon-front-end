/* ============================================================================
   brand-logo.tsx — LOGO OFFICIEL "Rijal Lghayth"
   ----------------------------------------------------------------------------
   Le logo fourni est une image dont le FOND SOMBRE est identique a celui de
   l'app (#0F1418). On l'affiche donc directement, SANS cadre ni pastille :
   son fond se fond dans la page et le cadre devient invisible.
   Il contient DEJA le nom + le slogan -> on ne re-ecrit AUCUN texte a cote.
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
  /** true sur les ecrans d'entree pour un chargement prioritaire */
  priority?: boolean
}) {
  return (
    <Image
      src="/logo.jpeg"
      alt="Rijal Lghayth — Entraide, Proximité, Sécurité"
      width={size * 2}
      height={size * 2}
      priority={priority}
      // object-contain = on voit tout le logo ; le fond sombre se fond dans la page
      className={cn('select-none object-contain', className)}
      style={{ width: size, height: 'auto' }}
    />
  )
}
