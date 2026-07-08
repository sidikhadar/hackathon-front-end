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
import { Inter, Oswald, Cairo } from 'next/font/google'
import { LanguageProvider } from '@/lib/i18n'
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

/* Police ARABE : Cairo (glyphes arabes modernes + lisibles).
   Utilisée en repli (fallback) pour tous les caractères arabes, aussi bien
   dans le corps de texte que dans les titres. */
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cairo',
})

/* -------------------- Métadonnées (SEO + PWA) -------------------- */
export const metadata: Metadata = {
  title: 'Rijal Lghayth — Entraide · Proximité · Sécurité',
  description:
    'Demandez de l’aide à vos voisins en un geste, en cas d’urgence, à Nouakchott. Géolocalisation et alertes en temps réel.',
  generator: 'v0.app',
  manifest: '/manifest.json', // Rend l'app installable (PWA)
  icons: {
    icon: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Rijal Lghayth',
  },
}

/* -------------------- Viewport MOBILE-FIRST --------------------
   maximumScale + userScalable=false empêchent le zoom automatique
   des champs de saisie sur iOS Safari. themeColor = fond clair. */
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
    // On applique le fond sombre + les variables de police sur <html>.
    // lang/dir sont ajustes dynamiquement par LanguageProvider (FR = ltr, AR = rtl).
    <html
      lang="fr"
      dir="ltr"
      className={`${inter.variable} ${oswald.variable} ${cairo.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {/* LanguageProvider rend la langue + les traductions accessibles partout */}
        <LanguageProvider>{children}</LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
