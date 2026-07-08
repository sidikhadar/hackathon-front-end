/* ============================================================================
   emergencies.ts — DONNEES PARTAGEES des 6 types d'urgence
   ----------------------------------------------------------------------------
   Centralise ici la liste des urgences (id, libelle, icone, couleur d'accent)
   pour qu'elle soit reutilisable partout : grille de selection, detail d'une
   alerte, historique, etc. Un seul endroit a modifier = coherence garantie.
   ============================================================================ */

import {
  ShieldAlert,
  HeartPulse,
  Flame,
  Car,
  Baby,
  CircleEllipsis,
  type LucideIcon,
} from 'lucide-react'

export type EmergencyType = {
  id: string
  label: string // Libelle affiche (FR)
  hint: string // Courte precision sous le libelle
  Icon: LucideIcon // Icone lucide distincte
  /** Teinte d'accent (variable CSS) pour differencier visuellement chaque type */
  tint: string
}

export const EMERGENCY_TYPES: EmergencyType[] = [
  {
    id: 'agression',
    label: 'Agression',
    hint: 'Violence, vol',
    Icon: ShieldAlert,
    tint: 'var(--coral)',
  },
  {
    id: 'malaise',
    label: 'Malaise',
    hint: 'Urgence médicale',
    Icon: HeartPulse,
    tint: '#4a9eff',
  },
  {
    id: 'incendie',
    label: 'Incendie',
    hint: 'Feu, fumée',
    Icon: Flame,
    tint: '#f5a524',
  },
  {
    id: 'voiture',
    label: 'Voiture bloquée',
    hint: 'Panne, accident',
    Icon: Car,
    tint: '#3ddc97',
  },
  {
    id: 'enfant',
    label: 'Enfant perdu',
    hint: 'Disparition',
    Icon: Baby,
    tint: '#b388ff',
  },
  {
    id: 'autre',
    label: 'Autre',
    hint: 'Autre urgence',
    Icon: CircleEllipsis,
    tint: '#8a97a6',
  },
]
