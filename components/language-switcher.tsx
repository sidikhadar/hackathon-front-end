/* ============================================================================
   language-switcher.tsx — SELECTEUR DE LANGUE (Francais / Arabe)
   ----------------------------------------------------------------------------
   Petit "interrupteur segmente" avec les 2 drapeaux :
     - Drapeau France  -> Francais (lecture gauche->droite)
     - Drapeau Mauritanie -> Arabe (lecture droite->gauche)
   Au clic, on change la langue via le contexte i18n : toute l'app bascule.
   Le bouton de la langue ACTIVE est mis en avant (surface claire + ombre).
   ============================================================================ */

'use client'

import { useLanguage, type Lang } from '@/lib/i18n'
import { FranceFlag, MauritaniaFlag } from '@/components/flags'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useLanguage()

  // Liste des langues proposees (drapeau + libelle)
  const options: { code: Lang; label: string; Flag: typeof FranceFlag }[] = [
    { code: 'fr', label: t.langNames.fr, Flag: FranceFlag },
    { code: 'ar', label: t.langNames.ar, Flag: MauritaniaFlag },
  ]

  return (
    <div
      className={cn(
        // Conteneur "pilule" qui regroupe les 2 choix
        'inline-flex items-center gap-1 rounded-full border border-border bg-card/70 p-1 backdrop-blur',
        className,
      )}
      role="group"
      aria-label="Choisir la langue"
    >
      {options.map(({ code, label, Flag }) => {
        const active = lang === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-all duration-200',
              active
                ? 'bg-secondary text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {/* Drapeau dans un petit cadre arrondi */}
            <span className="h-4 w-6 overflow-hidden rounded-[3px] ring-1 ring-white/15">
              <Flag className="h-full w-full" />
            </span>
            {label}
          </button>
        )
      })}
    </div>
  )
}
