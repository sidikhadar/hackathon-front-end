/* ============================================================================
   emergency-sheet.tsx — FEUILLE DU BAS : choix du TYPE d'urgence (6 categories)
   ----------------------------------------------------------------------------
   S'ouvre au clic sur le bouton "AIDE". Affiche une grille 2 colonnes des 6
   types d'urgence, chacun avec son icone et sa teinte propre.
   - Fond assombri (backdrop) cliquable pour fermer
   - Animation d'entree (glisse depuis le bas + fondu)
   - Selection = simulation : on affiche un petit etat "envoi" puis on navigue
     vers la page de confirmation (a construire dans un prochain prompt).
   ============================================================================ */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { EMERGENCY_TYPES } from '@/lib/emergencies'
import { cn } from '@/lib/utils'

export function EmergencySheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()

  // Bloque le defilement de l'arriere-plan quand la feuille est ouverte
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Fermeture avec la touche Echap (accessibilite clavier)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  // Selection d'un type -> (simulation) navigation vers la confirmation
  function handleSelect(id: string) {
    onClose()
    // La page /alert/new sera construite dans un prochain prompt.
    router.push(`/alert/new?type=${id}`)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Choisir le type d'urgence"
    >
      {/* --- Fond assombri (clic = fermer) --- */}
      <button
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* --- Panneau de la feuille --- */}
      <div
        className={cn(
          'relative z-10 w-full max-w-[440px] rounded-t-[2rem] border border-border bg-popover px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3',
          'shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.8)]',
          'animate-in slide-in-from-bottom duration-300 ease-out',
        )}
      >
        {/* Poignee de glissement (indice visuel) */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted-foreground/30" />

        {/* En-tete */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Quelle est l'urgence ?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sélectionnez pour alerter vos voisins
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* --- Grille 2 colonnes des 6 types d'urgence --- */}
        <div className="grid grid-cols-2 gap-3">
          {EMERGENCY_TYPES.map(({ id, label, hint, Icon, tint }) => (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className={cn(
                'group flex flex-col items-start gap-3 rounded-3xl border border-border bg-card p-4 text-left',
                'transition-all duration-200 hover:border-white/20 hover:bg-accent',
                'active:scale-[0.97]',
              )}
            >
              {/* Pastille d'icone teintee selon le type */}
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110"
                style={{
                  backgroundColor: `color-mix(in srgb, ${tint} 18%, transparent)`,
                  color: tint,
                }}
              >
                <Icon className="h-6 w-6" strokeWidth={2.2} />
              </span>
              <span className="leading-tight">
                <span className="block font-semibold text-foreground">{label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {hint}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
