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

/* Drapeau de la Mauritanie (version officielle depuis 2017) :
   - Champ vert au centre
   - Deux bandes rouges (en haut et en bas)
   - Croissant dore ouvert vers le HAUT + etoile a 5 branches doree.
   Le croissant est obtenu par un "masque" : un grand cercle plein moins un
   cercle decale vers le haut, ce qui laisse une forme de croissant. */
export function MauritaniaFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 600"
      className={className}
      role="img"
      aria-label="العربية"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Masque : blanc = visible, noir = cache.
            Grand cercle (visible) - cercle decale vers le haut (cache)
            => il ne reste que la partie basse en forme de croissant. */}
        <mask id="rl-crescent">
          <rect width="900" height="600" fill="black" />
          <circle cx="450" cy="330" r="120" fill="white" />
          <circle cx="450" cy="290" r="120" fill="black" />
        </mask>
      </defs>

      {/* Bandes rouges (fond entier rouge) */}
      <rect width="900" height="600" fill="#CE1126" />
      {/* Champ vert central (laisse le rouge apparaitre en haut et en bas) */}
      <rect y="100" width="900" height="400" fill="#006233" />

      {/* Croissant dore (rectangle dore visible seulement via le masque) */}
      <rect
        width="900"
        height="600"
        fill="#FFC400"
        mask="url(#rl-crescent)"
      />

      {/* Etoile doree a 5 branches, posee dans l'ouverture du croissant */}
      <polygon
        fill="#FFC400"
        points="450,238 460,266.3 489.9,267 466.2,285.3 474.7,314 450,297 425.3,314 433.8,285.3 410.1,267 440,266.3"
      />
    </svg>
  )
}
