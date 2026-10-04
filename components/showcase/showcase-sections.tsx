import {
  ArrowUpRight,
  BellRing,
  Languages,
  MapPin,
  PhoneCall,
  Smartphone,
  Users,
} from 'lucide-react'
import { PhoneFrame } from './phone-frame'
import { LIVE_URL } from './showcase-hero'

const features = [
  {
    icon: BellRing,
    title: 'Alerte en un geste',
    text: "Un grand bouton AIDE, pensé pour être utilisé sous stress : on choisit le type d'urgence et les voisins sont prévenus.",
  },
  {
    icon: MapPin,
    title: 'Carte en temps réel',
    text: "La personne en danger voit les voisins qui arrivent, et les voisins voient sa position exacte sur la carte.",
  },
  {
    icon: Users,
    title: 'Réseau de voisins',
    text: "Liste des alertes à proximité avec distance, gravité et message, puis un bouton « Je réponds » pour aller aider.",
  },
  {
    icon: PhoneCall,
    title: 'Secours officiels',
    text: 'Accès direct à la Police, aux Pompiers et à l’Ambulance depuis chaque alerte, sans chercher les numéros.',
  },
  {
    icon: Languages,
    title: 'Français et arabe',
    text: "Interface bilingue avec bascule instantanée et mise en page de droite à gauche (RTL) pour l'arabe.",
  },
  {
    icon: Smartphone,
    title: 'Installable (PWA)',
    text: "S'ajoute à l'écran d'accueil comme une vraie application mobile, sans passer par un store.",
  },
]

const steps = [
  { n: '01', title: "J'appuie sur AIDE", text: "Je choisis le type d'urgence : malaise, agression, incendie, accident…" },
  { n: '02', title: 'Mes voisins sont alertés', text: "Les voisins proches et mon contact d'urgence reçoivent l'alerte avec ma position." },
  { n: '03', title: "Quelqu'un arrive", text: "Je vois sur la carte qui est « En route », jusqu'à ce que je sois en sécurité." },
]

const screens = [
  { src: '/showcase/alerts.png', alt: 'Liste des alertes des voisins à proximité', label: 'Alertes des voisins' },
  { src: '/showcase/detail.png', alt: "Détail d'une alerte avec gravité, message et appels d'urgence", label: "Détail d'une alerte" },
  { src: '/showcase/history.png', alt: 'Historique des alertes passées et en cours', label: 'Historique' },
]

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-coral">{eyebrow}</span>
      <h2 className="text-balance font-display text-3xl font-semibold uppercase tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
    </div>
  )
}

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <SectionTitle eyebrow="Le problème" title="Chaque minute compte" />
      <p className="mt-6 text-pretty text-center text-base leading-relaxed text-muted-foreground md:text-lg">
        {
          "En cas d'urgence à Nouakchott, les secours peuvent mettre du temps à arriver, alors qu'un voisin se trouve souvent à quelques dizaines de mètres. Rijal Lghayth s'appuie sur la solidarité de quartier pour réduire ce délai : alerter les bonnes personnes, au bon endroit, immédiatement."
        }
      </p>
    </section>
  )
}

export function StepsSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <SectionTitle eyebrow="Fonctionnement" title="Trois étapes, zéro friction" />
      <ol className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <li key={step.n} className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6">
            <span className="font-display text-4xl font-semibold text-coral">{step.n}</span>
            <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function ScreensSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <SectionTitle eyebrow="Écrans" title="Une interface pensée pour l'urgence" />
      <ul className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 md:justify-center md:overflow-visible">
        {screens.map((screen) => (
          <li key={screen.src} className="flex shrink-0 snap-center flex-col items-center gap-4">
            <PhoneFrame src={screen.src} alt={screen.alt} className="w-[240px]" />
            <span className="text-sm font-medium text-muted-foreground">{screen.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <SectionTitle eyebrow="Fonctionnalités" title="Ce que fait l'application" />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral/15 text-coral">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function CreditsSection() {
  return (
    <section className="mx-auto max-w-3xl px-5 pb-20 pt-8">
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-card p-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-success">Équipe</span>
        <div className="flex flex-col gap-1">
          <p className="font-display text-2xl font-semibold uppercase text-foreground">HYBRIDS TECH</p>
          <p className="text-sm text-muted-foreground">Conçu et développé par Sidi Mohamed El Khader</p>
        </div>
        <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          {"Rôle : conception produit, design de l'interface mobile et développement front-end (Next.js, React, Tailwind CSS)."}
        </p>
        <a
          href={LIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-coral px-6 font-semibold text-white transition-transform active:scale-[0.98] sm:w-auto"
        >
          Essayer Rijal Lghayth
          <ArrowUpRight className="h-5 w-5" aria-hidden />
        </a>
      </div>
    </section>
  )
}
