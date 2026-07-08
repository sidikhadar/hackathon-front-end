/* ============================================================================
   help-contact.tsx — BOUTON "AIDE" + bulle d'information (numero de support)
   ----------------------------------------------------------------------------
   Affiche en haut des pages Connexion / Inscription un petit bouton "Aide".
   Au clic, une petite bulle s'ouvre avec : "Une question ? Contactez-nous au
   +222 37 16 20 07". Le numero est cliquable (lien tel:) pour appeler.
   IMPORTANT : le numero s'affiche TOUJOURS de gauche a droite (dir="ltr"),
   meme quand l'app est en arabe (RTL), afin de ne jamais inverser les chiffres.
   ============================================================================ */

'use client'

import { useEffect, useRef, useState } from 'react'
import { HelpCircle, Phone, X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/* Numero de support (constante = un seul endroit a modifier) */
const SUPPORT_PHONE = '+222 37 16 20 07'

export function HelpContact({ className }: { className?: string }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  // Ferme la bulle si on clique en dehors
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <div ref={boxRef} className={cn('relative', className)}>
      {/* --- Bouton "Aide" --- */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-accent"
        aria-expanded={open}
      >
        <HelpCircle className="h-4 w-4 text-coral" />
        {t.common.help}
      </button>

      {/* --- Bulle d'information (numero de support) --- */}
      {open && (
        <div
          className={cn(
            // Positionnee sous le bouton ; s'aligne cote "fin" (droite en LTR)
            'absolute end-0 top-[calc(100%+0.5rem)] z-50 w-64 rounded-2xl border border-border bg-popover p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]',
            'animate-in fade-in slide-in-from-top-1 duration-200',
          )}
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">
              {t.help.title}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.common.close}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {t.help.message}
          </p>

          {/* Numero cliquable — force LTR pour ne jamais inverser les chiffres */}
          <a
            href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}
            dir="ltr"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-coral/15 px-3 py-2 font-semibold text-coral transition-colors hover:bg-coral/25"
          >
            <Phone className="h-4 w-4" />
            {SUPPORT_PHONE}
          </a>
        </div>
      )}
    </div>
  )
}
