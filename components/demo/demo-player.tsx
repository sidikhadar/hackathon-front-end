'use client'

import { useState, type ComponentType } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  BroadcastScene,
  EnrouteScene,
  HomeScene,
  NotifyScene,
  SafeScene,
  TypeScene,
} from './demo-screens'

type Scene = {
  id: string
  title: string
  caption: string
  duration: number
  Screen: ComponentType
}

const SCENES: Scene[] = [
  {
    id: 'home',
    title: 'Un seul geste',
    caption: "Aïcha se sent mal. Elle ouvre l'application et appuie sur le grand bouton AIDE.",
    duration: 4200,
    Screen: HomeScene,
  },
  {
    id: 'type',
    title: "Type d'urgence",
    caption: 'Elle précise la situation en un seul tap : malaise.',
    duration: 3800,
    Screen: TypeScene,
  },
  {
    id: 'broadcast',
    title: 'Alerte diffusée',
    caption: "L'alerte part instantanément vers les voisins à proximité et vers son contact d'urgence.",
    duration: 4600,
    Screen: BroadcastScene,
  },
  {
    id: 'notify',
    title: 'Un voisin répond',
    caption: "Mohamed, à 350 m, reçoit la notification et appuie sur « J'arrive ».",
    duration: 4200,
    Screen: NotifyScene,
  },
  {
    id: 'enroute',
    title: 'Suivi en temps réel',
    caption: 'Aïcha voit Mohamed approcher sur la carte, avec la distance et le temps estimé.',
    duration: 5200,
    Screen: EnrouteScene,
  },
  {
    id: 'safe',
    title: 'Aide arrivée',
    caption: "Mohamed est sur place. Aïcha confirme qu'elle est en sécurité et l'alerte est clôturée.",
    duration: 4400,
    Screen: SafeScene,
  },
]

export function DemoPlayer() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  // Incremente pour relancer l'animation de la scene courante (rejouer / meme scene)
  const [runId, setRunId] = useState(0)

  const scene = SCENES[index]
  const Screen = scene.Screen

  const goTo = (i: number) => {
    setIndex((i + SCENES.length) % SCENES.length)
    setRunId((r) => r + 1)
  }

  const progressStyle = (duration: number) => ({
    animation: `demo-progress ${duration}ms linear forwards`,
    animationPlayState: playing ? 'running' : 'paused',
  })

  return (
    <div className="flex w-full flex-col items-center gap-10 md:flex-row md:items-center md:justify-center md:gap-16">
      {/* Telephone */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-10 rounded-full bg-coral/20 blur-[80px]"
        />
        <div className="relative w-[280px] rounded-[2.75rem] border border-white/10 bg-[#0a0e11] p-2.5 shadow-2xl shadow-black/60">
          <div
            className="relative h-[580px] overflow-hidden rounded-[2.25rem] bg-background"
            role="img"
            aria-label={`Écran de démonstration : ${scene.title}`}
          >
            <div
              key={`${scene.id}-${runId}`}
              className="h-full animate-in fade-in zoom-in-[0.97] duration-500"
            >
              <Screen />
            </div>
            <span
              aria-hidden
              className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black"
            />
          </div>
        </div>
      </div>

      {/* Narration + controles */}
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col gap-3" aria-live="polite">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
            Étape {index + 1} / {SCENES.length}
          </span>
          <h2 className="text-balance font-display text-3xl font-semibold uppercase text-foreground md:text-4xl">
            {scene.title}
          </h2>
          <p className="min-h-[3.5rem] text-pretty text-base leading-relaxed text-muted-foreground">
            {scene.caption}
          </p>
          {/* Barre maitresse : sa fin fait avancer la demo */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div
              key={`${scene.id}-${runId}`}
              className="h-full origin-left bg-coral"
              style={progressStyle(scene.duration)}
              onAnimationEnd={() => goTo(index + 1)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Étape précédente"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Mettre en pause' : 'Lire la démo'}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-white transition-transform active:scale-95"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Étape suivante"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(true)
              goTo(0)
            }}
            className="ms-auto flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Rejouer
          </button>
        </div>

        <ol className="flex flex-col gap-1" aria-label="Étapes de la démo">
          {SCENES.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === index ? 'step' : undefined}
                className={cn(
                  'flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-start transition-colors',
                  i === index ? 'bg-card' : 'hover:bg-card/60',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    i === index
                      ? 'bg-coral text-white'
                      : i < index
                        ? 'bg-coral/20 text-coral'
                        : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cn(
                    'text-sm font-medium',
                    i === index ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {s.title}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
