import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { DemoPlayer } from '@/components/demo/demo-player'

export const metadata: Metadata = {
  title: 'Démo — Rijal Lghayth',
  description:
    "Démo animée de Rijal Lghayth : une alerte d'urgence envoyée aux voisins, un voisin qui répond et le suivi en temps réel jusqu'à l'arrivée de l'aide.",
}

export default function DemoPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
        <Link href="/showcase" className="flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg border border-white/10"
          />
          <span className="font-display text-lg font-semibold uppercase tracking-wide">Rijal Lghayth</span>
        </Link>
        <Link
          href="/"
          className="flex h-11 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-secondary"
        >
          {"Ouvrir l'app"}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-5 pb-16 pt-4 md:pt-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="rounded-full border border-coral/30 bg-coral/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-coral">
            Démo interactive
          </span>
          <h1 className="text-balance font-display text-4xl font-semibold uppercase tracking-tight md:text-5xl">
            {"De l'alerte à l'aide en 4 minutes"}
          </h1>
          <p className="max-w-xl text-pretty text-muted-foreground">
            Suivez le parcours complet : une habitante de Nouakchott lance une alerte, un voisin la reçoit et vient
            {" l'aider."}
          </p>
        </div>

        <DemoPlayer />
      </section>
    </main>
  )
}
