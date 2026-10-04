import type { Metadata } from 'next'
import { ShowcaseHero } from '@/components/showcase/showcase-hero'
import {
  CreditsSection,
  FeaturesSection,
  ProblemSection,
  ScreensSection,
  StepsSection,
} from '@/components/showcase/showcase-sections'

export const metadata: Metadata = {
  title: 'Rijal Lghayth — Présentation du projet',
  description:
    "Étude de cas : application mobile d'entraide de voisinage à Nouakchott. Alerte en un geste, carte en temps réel, interface FR / AR.",
  openGraph: {
    title: 'Rijal Lghayth — Entraide · Proximité · Sécurité',
    description: "Application mobile d'entraide de voisinage pour les urgences à Nouakchott.",
    images: ['/showcase/home.png'],
  },
}

export default function ShowcasePage() {
  return (
    <main className="min-h-dvh bg-background text-foreground" dir="ltr" lang="fr">
      <ShowcaseHero />
      <ProblemSection />
      <StepsSection />
      <ScreensSection />
      <FeaturesSection />
      <CreditsSection />
    </main>
  )
}
