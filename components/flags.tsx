/* ============================================================================
   flags.tsx — PETITS DRAPEAUX (SVG) pour le selecteur de langue
   ----------------------------------------------------------------------------
   - FranceFlag       -> represente le FRANCAIS
   - MauritaniaFlag   -> represente l'ARABE (langue officielle de la Mauritanie)
   Ce sont de simples formes vectorielles (SVG), nettes a toute taille.
   On les affiche dans un petit cadre arrondi via `className`.
   ============================================================================ */

/* Drapeau de la France : 3 bandes verticales (bleu / blanc / rouge) */
export function FranceFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 3 2"
      className={className}
      role="img"
      aria-label="Français"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="1" height="2" x="0" fill="#0055A4" />
      <rect width="1" height="2" x="1" fill="#FFFFFF" />
      <rect width="1" height="2" x="2" fill="#EF4135" />
    </svg>
  )
}

/* Drapeau de la Mauritanie : champ vert, bandes rouges haut/bas,
   croissant + etoile dores (symboles au centre). */
export function MauritaniaFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 600"
      className={className}
      role="img"
      aria-label="العربية"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Bandes rouges (haut et bas) */}
      <rect width="900" height="600" fill="#D01C1F" />
      {/* Champ vert central */}
      <rect y="100" width="900" height="400" fill="#00A651" />

      {/* Croissant dore (croissant = grand cercle jaune - cercle vert decale) */}
      <g fill="#FFD200">
        <path d="M450 200a150 150 0 1 0 0 300 120 120 0 1 1 0-300z" />
        {/* Etoile a 5 branches au centre du croissant */}
        <path d="M450 300l17 52h55l-44 32 17 52-45-32-45 32 17-52-44-32h55z" />
      </g>
    </svg>
  )
}
