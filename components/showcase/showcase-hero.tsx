import Image from 'next/image'
import { ArrowUpRight, Code2 } from 'lucide-react'
import { PhoneFrame } from './phone-frame'

export const LIVE_URL = 'https://hackathon-front-end-gilt.vercel.app'
export const REPO_URL = 'https://github.com/sidikhadar/hackathon-front-end'

const tags = ['Next.js 16', 'React 19', 'Tailwind CSS v4', 'Leaflet', 'PWA', 'FR / AR (RTL)']

export function ShowcaseHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-coral/20 blur-[140px]"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 px-5 pb-16 pt-12 md:flex-row md:gap-16 md:pt-20">
        <div className="flex flex-1 flex-col items-center gap-6 text-center md:items-start md:text-start">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpeg"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl border border-white/10"
            />
            <span className="rounded-full border border-coral/30 bg-coral/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-coral">
              Projet hackathon
            </span>
          </div>

          <h1 className="text-balance font-display text-5xl font-semibold uppercase leading-none tracking-tight text-foreground md:text-7xl">
            Rijal Lghayth
          </h1>
          <p className="font-display text-lg uppercase tracking-[0.25em] text-muted-foreground">
            Entraide · Proximité · Sécurité
          </p>
          <p className="max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {
              "Une application mobile d'entraide de voisinage pour Nouakchott : en un seul geste, une personne en danger alerte ses voisins proches, qui voient sa position et peuvent venir l'aider en temps réel."
            }
          </p>

          <ul className="flex flex-wrap justify-center gap-2 md:justify-start" aria-label="Technologies">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-coral px-6 font-semibold text-white transition-transform active:scale-[0.98]"
            >
              Voir la démo en ligne
              <ArrowUpRight className="h-5 w-5" aria-hidden />
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <Code2 className="h-5 w-5" aria-hidden />
              Code source
            </a>
          </div>
        </div>

        <div className="flex flex-1 items-end justify-center gap-4">
          <PhoneFrame
            src="/showcase/welcome.png"
            alt="Écran d'accueil de Rijal Lghayth avec le logo et les boutons Créer un compte et Se connecter"
            className="hidden max-w-[210px] -rotate-6 opacity-90 sm:block"
          />
          <PhoneFrame
            src="/showcase/home.png"
            alt="Écran principal avec le grand bouton AIDE pour alerter les voisins"
            className="z-10"
            priority
          />
        </div>
      </div>
    </section>
  )
}
