/* ============================================================================
   language-switcher.tsx — SELECTEUR DE LANGUE (Francais / Arabe)
   ----------------------------------------------------------------------------
   Affiche 2 "pastilles-drapeaux" (facon Smart Reglili) SANS texte :
     - Drapeau France     -> Francais (lecture gauche->droite)
     - Drapeau Mauritanie -> Arabe (lecture droite->gauche)
   La langue ACTIVE est mise en avant par un contour corail + une legere echelle.
   Au clic, toute l'app bascule (langue + sens de lecture) via le contexte i18n.
   ============================================================================ */

'use client'

import { useLanguage, type Lang } from '@/lib/i18n'
import { FranceFlag, MauritaniaFlag } from '@/components/flags'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useLanguage()

  // Liste des langues proposees (drapeau + libelle pour l'accessibilite)
  const options: { code: Lang; label: string; Flag: typeof FranceFlag }[] = [
    { code: 'fr', label: t.langNames.fr, Flag: FranceFlag },
    { code: 'ar', label: t.langNames.ar, Flag: MauritaniaFlag },
  ]

  return (
    <div
      className={cn('inline-flex items-center gap-2', className)}
      role="group"
      aria-label="Choisir la langue / اختر اللغة"
    >
      {options.map(({ code, label, Flag }) => {
        const active = lang === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            aria-label={label}
            title={label}
            className={cn(
              // Pastille-drapeau : rectangle arrondi qui contient le drapeau
              'relative h-9 w-12 overflow-hidden rounded-xl transition-all duration-200 active:scale-95',
              active
                ? 'ring-2 ring-coral ring-offset-2 ring-offset-background'
                : 'opacity-60 ring-1 ring-white/15 hover:opacity-100',
            )}
          >
            <Flag className="h-full w-full" />
          </button>
        )
      })}
    </div>
  )
}
