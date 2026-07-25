/* ============================================================================
   neighbor-alerts.ts — DONNEES PARTAGEES des alertes de voisins
   ----------------------------------------------------------------------------
   Source unique pour la LISTE des alertes (app/alerts) et le DETAIL d'une
   alerte (app/alerts/[id]). Ainsi les deux ecrans restent toujours coherents.
   Donnees simulees pour la demonstration (a brancher sur le backend plus tard).
   ============================================================================ */

import {
  ShieldAlert,
  HeartPulse,
  Flame,
  Car,
  type LucideIcon,
} from 'lucide-react'

/** Niveau de gravite -> couleur du badge (vert / orange / rouge) */
export type Severity = 'low' | 'medium' | 'high'

export type NeighborAlert = {
  id: string
  name: string
  photo: string // Photo de la victime (dans /public/victims)
  Icon: LucideIcon // Icone du type d'urgence
  tone: 'coral' | 'success' | 'amber'
  severity: Severity
  label: { fr: string; ar: string } // Type d'urgence
  message: { fr: string; ar: string } // Message laisse par la victime
  distance: string // Distance (affichee en LTR)
  time: { fr: string; ar: string } // Delai depuis l'alerte
  phone: string // Numero de la victime (pour l'appeler)
}

export const NEIGHBOR_ALERTS: NeighborAlert[] = [
  {
    id: '1',
    name: 'Fatimetou',
    photo: '/victims/fatimetou.png',
    Icon: HeartPulse,
    tone: 'coral',
    severity: 'high',
    label: { fr: 'Urgence médicale', ar: 'حالة طبية طارئة' },
    message: {
      fr: 'Je ne me sens pas bien, j’ai du mal à respirer. J’ai besoin d’aide rapidement.',
      ar: 'لا أشعر أنني بخير، أجد صعوبة في التنفس. أحتاج مساعدة سريعة.',
    },
    distance: '120 m',
    time: { fr: 'il y a 2 min', ar: 'قبل دقيقتين' },
    phone: '+222 45 12 34 56',
  },
  {
    id: '2',
    name: 'Mohamed',
    photo: '/victims/mohamed.png',
    Icon: ShieldAlert,
    tone: 'amber',
    severity: 'medium',
    label: { fr: 'Personne suspecte', ar: 'شخص مشبوه' },
    message: {
      fr: 'Une personne rôde autour des maisons depuis un moment. Restez vigilants.',
      ar: 'شخص يتجول حول المنازل منذ فترة. كونوا حذرين.',
    },
    distance: '340 m',
    time: { fr: 'il y a 8 min', ar: 'قبل 8 دقائق' },
    phone: '+222 46 78 90 12',
  },
  {
    id: '3',
    name: 'Aïcha',
    photo: '/victims/aicha.png',
    Icon: Flame,
    tone: 'coral',
    severity: 'high',
    label: { fr: 'Début d’incendie', ar: 'بداية حريق' },
    message: {
      fr: 'Il y a de la fumée dans la cuisine, le feu commence à prendre. Venez vite !',
      ar: 'يوجد دخان في المطبخ، النار بدأت تشتعل. تعالوا بسرعة !',
    },
    distance: '500 m',
    time: { fr: 'il y a 15 min', ar: 'قبل 15 دقيقة' },
    phone: '+222 44 55 66 77',
  },
  {
    id: '4',
    name: 'Sidi',
    photo: '/victims/sidi.png',
    Icon: Car,
    tone: 'success',
    severity: 'low',
    label: { fr: 'Accident de route', ar: 'حادث سير' },
    message: {
      fr: 'Petit accrochage sans blessé, mais ma voiture bloque la route. Un coup de main serait utile.',
      ar: 'حادث بسيط دون إصابات، لكن سيارتي تسد الطريق. مساعدتكم مفيدة.',
    },
    distance: '1,2 km',
    time: { fr: 'il y a 22 min', ar: 'قبل 22 دقيقة' },
    phone: '+222 47 88 99 00',
  },
]

/** Recupere une alerte par son identifiant (ou undefined si introuvable) */
export function getNeighborAlert(id: string): NeighborAlert | undefined {
  return NEIGHBOR_ALERTS.find((a) => a.id === id)
}

/** Classes de couleur selon la "tonalite" de l'alerte (fond doux + texte) */
export const TONE_CLASSES: Record<NeighborAlert['tone'], string> = {
  coral: 'bg-coral/15 text-coral',
  success: 'bg-success/15 text-success',
  amber: 'bg-amber-500/15 text-amber-600',
}
