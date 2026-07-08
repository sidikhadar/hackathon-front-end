/* ============================================================================
   otp-input.tsx — CHAMP DE SAISIE DU CODE OTP (6 chiffres)
   ----------------------------------------------------------------------------
   6 cases individuelles avec :
     - passage automatique a la case suivante quand on tape un chiffre
     - retour arriere intelligent (efface + revient a la case precedente)
     - collage (paste) d'un code complet reparti sur toutes les cases
     - clavier numerique force sur mobile (inputMode="numeric")
   Remonte la valeur complete au parent via onChange.
   ============================================================================ */

'use client'

import { useRef, type ChangeEvent, type KeyboardEvent, type ClipboardEvent } from 'react'
import { cn } from '@/lib/utils'

export function OtpInput({
  value,
  onChange,
  length = 6,
}: {
  value: string
  onChange: (val: string) => void
  length?: number
}) {
  // Refs vers chaque case pour gerer le focus automatiquement
  const inputs = useRef<Array<HTMLInputElement | null>>([])

  // Saisie d'un chiffre dans une case
  function handleChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const digit = e.target.value.replace(/\D/g, '').slice(-1) // garde 1 chiffre
    const next = value.split('')
    next[index] = digit
    const joined = next.join('').slice(0, length)
    onChange(joined)

    // Avance automatiquement vers la case suivante
    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  // Gestion du retour arriere (Backspace)
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  // Collage d'un code complet
  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted)
    // Place le focus sur la derniere case remplie
    const target = Math.min(pasted.length, length - 1)
    inputs.current[target]?.focus()
  }

  return (
    <div className="flex items-center justify-between gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className={cn(
            'h-14 w-full rounded-2xl border bg-input text-center font-display text-2xl font-semibold text-foreground',
            'transition-all duration-150 outline-none',
            'focus:border-coral focus:ring-4 focus:ring-coral/25',
            value[i] ? 'border-coral/60' : 'border-border',
          )}
        />
      ))}
    </div>
  )
}
