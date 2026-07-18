/* ============================================================================
   field.tsx — CHAMP DE FORMULAIRE PREMIUM reutilisable (label + input + icone)
   ----------------------------------------------------------------------------
   Uniformise l'apparence de tous les champs des formulaires (connexion,
   inscription) : label, icone a gauche, focus corail, coins arrondis.
   - `prefix` permet d'afficher un indicatif (ex: +222) colle a gauche.
   - Si `type="password"`, un bouton "oeil" apparait a droite pour afficher /
     masquer le mot de passe.
   - Taille de police >= 16px pour eviter le zoom auto d'iOS Safari.
   ============================================================================ */

'use client'

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  /** Icone affichee a gauche du champ */
  icon?: ReactNode
  /** Texte fixe colle a gauche (ex: indicatif "+222") */
  prefix?: string
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, icon, prefix, className, id, type = 'text', ...props },
  ref,
) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  // Gestion de l'affichage du mot de passe (bouton "oeil")
  const isPassword = type === 'password'
  const [show, setShow] = useState(false)
  // Type reel de l'input : si mot de passe visible -> "text", sinon le type d'origine
  const inputType = isPassword ? (show ? 'text' : 'password') : type

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
        {label}
      </label>

      <div
        className={cn(
          'flex items-center gap-2 rounded-2xl border border-border bg-input px-3.5',
          'transition-all duration-150 focus-within:border-coral focus-within:ring-4 focus-within:ring-coral/25',
        )}
      >
        {/* Icone optionnelle */}
        {icon && <span className="text-muted-foreground">{icon}</span>}

        {/* Indicatif fixe optionnel */}
        {prefix && (
          <span
            dir="ltr"
            className="border-r border-border pr-2 text-base font-medium text-muted-foreground"
          >
            {prefix}
          </span>
        )}

        <input
          id={fieldId}
          ref={ref}
          type={inputType}
          className={cn(
            // text-base (16px) = pas de zoom auto sur iOS
            'h-14 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/60',
            className,
          )}
          {...props}
        />

        {/* Bouton "oeil" pour les mots de passe uniquement */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? 'Masquer' : 'Afficher'}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  )
})
