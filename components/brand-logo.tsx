/* ============================================================================
   brand-logo.tsx — LOGO OFFICIEL "Rijal Lghayth" (medaillon premium)
   ----------------------------------------------------------------------------
   Le logo fourni est une image carree avec un fond sombre. Plutot que de
   laisser un "carre" aux bords nets peu esthetique, on l'habille dans un
   MEDAILLON premium :
     - un halo corail flou en arriere-plan (profondeur + chaleur)
     - un cadre arrondi avec un fin liesere lumineux (ring) et un degrade
       subtil facon carte haut de gamme, avec une ombre portee douce.
   Le logo contient DEJA le nom + le slogan -> on ne re-ecrit AUCUN texte ici.
   ============================================================================ */

import Image from 'next/image'
import { cn } from '@/lib/utils'

export function BrandLogo({
  size = 200,
  className,
  priority = false,
}: {
  /** Cote (px) du medaillon carre affiche */
  size?: number
  className?: string
  /** true sur les ecrans d'entree pour un chargement prioritaire */
  priority?: boolean
}) {
  return (
    <div
      className={cn('relative inline-flex', className)}
      style={{ width: size, height: size }}
    >
      {/* Halo corail flou derriere le medaillon (donne de la profondeur) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-5 rounded-[44px] bg-coral/15 blur-2xl"
      />

      {/* Cadre / medaillon premium : coins arrondis, fin liesere lumineux
          (via un degrade + ring), ombre portee douce. Le p-[1.5px] cree le
          liesere entre le degrade exterieur et l'image interieure. */}
      <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-gradient-to-b from-white/[0.10] to-white/[0.02] p-[1.5px] shadow-[0_28px_60px_-24px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
        <div className="h-full w-full overflow-hidden rounded-[30px]">
          <Image
            src="/logo.jpeg"
            alt="Rijal Lghayth — Entraide, Proximité, Sécurité"
            width={size * 2}
            height={size * 2}
            priority={priority}
            // object-cover = l'image remplit joliment tout le medaillon carre
            className="h-full w-full select-none object-cover"
          />
        </div>
      </div>
    </div>
  )
}
