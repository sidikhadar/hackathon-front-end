/* ============================================================================
   layout.tsx — GABARIT RACINE de l'application (enveloppe toutes les pages)
   ----------------------------------------------------------------------------
   Rôle de ce fichier :
     - Charger les 2 polices : Oswald (titres condensés) + Inter (texte)
     - Définir les métadonnées SEO et l'icône
     - Configurer le viewport MOBILE-FIRST (empêche le zoom auto iOS)
     - Brancher le manifest PWA et la couleur de thème sombre
     - Appliquer le fond sombre sur la balise <html>
   ============================================================================ */

import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Oswald } from 'next/font/google'
import './globals.css'

/* Police du CORPS de texte : Inter (très lisible, moderne) */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Utilisée par --font-sans dans globals.css
})

/* Police des TITRES : Oswald (condensée, impactante pour l'urgence) */
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald', // Utilisée par --font-display dans globals.css
})

/* -------------------- Métadonnées (SEO + PWA) -------------------- */
export const metadata: Metadata = {
  title: 'Voisin d’Urgence — L’entraide de quartier à Nouakchott',
  description:
    'Demandez de l’aide à vos voisins en un geste, en cas d’urgence. Géolocalisation et alertes en temps réel.',
  generator: 'v0.app',
  manifest: '/manifest.json', // Rend l'app installable (PWA)
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Voisin d’Urgence',
  },
}

/* -------------------- Viewport MOBILE-FIRST --------------------
   maximumScale + userScalable=false empêchent le zoom automatique
   des champs de saisie sur iOS Safari. themeColor = fond sombre. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f1418',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // On applique le fond sombre + les variables de police sur <html>
    <html lang="fr" className={`${inter.variable} ${oswald.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
