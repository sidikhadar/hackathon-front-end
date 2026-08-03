/* ----------------------------------------------------------------------------
   DONNEES DE L'HISTORIQUE DES ALERTES (simulees)
   Utilisees par la page /history. Chaque entree represente une alerte passee
   ou en cours, avec le role de l'utilisateur (victime ou aidant).
   Le champ `typeId` reference un id de EMERGENCY_TYPES (lib/emergencies.ts).
   ---------------------------------------------------------------------------- */

export type HistoryStatus = 'resolved' | 'ongoing'
export type HistoryRole = 'victim' | 'responder'

export type HistoryEntry = {
  id: string
  typeId: string // reference EMERGENCY_TYPES[].id
  status: HistoryStatus
  role: HistoryRole
  date: string // ISO — formatee a l'affichage selon la langue
  place: string // quartier / lieu court
}

export const HISTORY: HistoryEntry[] = [
  {
    id: 'h1',
    typeId: 'agression',
    status: 'ongoing',
    role: 'responder',
    date: '2026-08-03T01:40:00',
    place: 'Tevragh-Zeina',
  },
  {
    id: 'h2',
    typeId: 'voiture',
    status: 'resolved',
    role: 'victim',
    date: '2026-07-28T18:12:00',
    place: 'Ksar',
  },
  {
    id: 'h3',
    typeId: 'malaise',
    status: 'resolved',
    role: 'responder',
    date: '2026-07-21T09:05:00',
    place: 'Tevragh-Zeina',
  },
  {
    id: 'h4',
    typeId: 'enfant',
    status: 'resolved',
    role: 'responder',
    date: '2026-07-14T16:30:00',
    place: 'Sebkha',
  },
  {
    id: 'h5',
    typeId: 'incendie',
    status: 'resolved',
    role: 'victim',
    date: '2026-06-30T22:48:00',
    place: 'Arafat',
  },
]
