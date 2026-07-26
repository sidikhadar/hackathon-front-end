'use client'

/**
 * CARTE TEMPS REEL (Leaflet) — composant client uniquement.
 * ---------------------------------------------------------
 * Affiche :
 *   - un pin VICTIME pulsant au centre (rouge corail)
 *   - des pins VOISINS qui ont repondu (vert menthe)
 *
 * Les marqueurs sont dessines en HTML/CSS via `divIcon` (pas d'images),
 * ce qui garantit un rendu net et anime sans asset externe.
 *
 * Ce composant est charge dynamiquement (ssr:false) car Leaflet a besoin
 * de `window`. Voir app/alert/live/page.tsx.
 */

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export type Responder = {
  id: string
  name: string
  lat: number
  lng: number
  distance: number // en metres
  responded: boolean
}

// --- Icone VICTIME : gros point corail avec halo pulsant ---
const victimIcon = L.divIcon({
  className: '',
  html: `
    <div class="rl-pin rl-pin--victim">
      <span class="rl-pin__pulse"></span>
      <span class="rl-pin__core"></span>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

// --- Icone VOISIN : point vert menthe (plus petit) ---
function neighborIcon(active: boolean) {
  return L.divIcon({
    className: '',
    html: `
      <div class="rl-pin rl-pin--neighbor ${active ? 'is-active' : 'is-idle'}">
        <span class="rl-pin__core"></span>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

// --- Icone VOUS : point bleu pulsant (le voisin qui repond, vue "En route") ---
const youIcon = L.divIcon({
  className: '',
  html: `
    <div class="rl-pin rl-pin--you">
      <span class="rl-pin__pulse"></span>
      <span class="rl-pin__core"></span>
    </div>
  `,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
})

/* Recentre/anime la carte quand le centre change (transition fluide) */
function Recenter({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 0.8 })
  }, [center, map])
  return null
}

export default function LiveMap({
  center,
  responders,
  you,
}: {
  center: { lat: number; lng: number }
  responders: Responder[]
  /* Position optionnelle du voisin qui repond (affiche un pin bleu "Vous") */
  you?: { lat: number; lng: number }
}) {
  const c: [number, number] = [center.lat, center.lng]

  return (
    <MapContainer
      center={c}
      zoom={16}
      zoomControl={false}
      attributionControl={false}
      className="h-full w-full"
      style={{ background: '#0c1424' }}
    >
      {/* Fond de carte sombre (CartoDB dark) pour rester coherent avec l'app */}
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

      {/* Zone d'alerte autour de la victime */}
      <Circle
        center={c}
        radius={220}
        pathOptions={{
          color: '#ff6b4a',
          fillColor: '#ff6b4a',
          fillOpacity: 0.08,
          weight: 1,
        }}
      />

      {/* Pin victime (centre) */}
      <Marker position={c} icon={victimIcon} />

      {/* Pins voisins */}
      {responders.map((r) => (
        <Marker
          key={r.id}
          position={[r.lat, r.lng]}
          icon={neighborIcon(r.responded)}
        />
      ))}

      {/* Pin "Vous" (le voisin qui repond) — bleu pulsant */}
      {you && <Marker position={[you.lat, you.lng]} icon={youIcon} />}

      <Recenter center={c} />
    </MapContainer>
  )
}
