'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  BatteryFull,
  Bell,
  CarFront,
  Check,
  Flame,
  HeartPulse,
  History,
  Home,
  MapPin,
  Navigation,
  ShieldAlert,
  ShieldCheck,
  Signal,
  Star,
  User,
  Wifi,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function useCountTo(target: number, from: number, durationMs: number) {
  const [value, setValue] = useState(from)
  useEffect(() => {
    const steps = 30
    const stepMs = durationMs / steps
    let i = 0
    const id = setInterval(() => {
      i += 1
      setValue(Math.round(from + ((target - from) * i) / steps))
      if (i >= steps) clearInterval(id)
    }, stepMs)
    return () => clearInterval(id)
  }, [target, from, durationMs])
  return value
}

function useDelayedFlag(delayMs: number) {
  const [flag, setFlag] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setFlag(true), delayMs)
    return () => clearTimeout(id)
  }, [delayMs])
  return flag
}

export function StatusBar({ time = '14:32' }: { time?: string }) {
  return (
    <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[11px] font-semibold text-foreground">
      <span>{time}</span>
      <span className="flex items-center gap-1" aria-hidden>
        <Signal className="h-3 w-3" />
        <Wifi className="h-3 w-3" />
        <BatteryFull className="h-3.5 w-3.5" />
      </span>
    </div>
  )
}

function TapIndicator({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('pointer-events-none absolute', className)}>
      <span className="absolute inset-0 rounded-full bg-white/60 motion-safe:animate-ping" />
      <span className="relative block h-7 w-7 rounded-full border-2 border-white bg-white/40" />
    </span>
  )
}

function BottomNav({ active = 'home' }: { active?: 'home' | 'alerts' }) {
  const items = [
    { id: 'home', icon: Home },
    { id: 'alerts', icon: Bell },
    { id: 'history', icon: History },
    { id: 'profile', icon: User },
  ]
  return (
    <div className="mt-auto flex items-center justify-around border-t border-border px-4 py-3">
      {items.map(({ id, icon: Icon }) => (
        <Icon
          key={id}
          aria-hidden
          className={cn('h-5 w-5', id === active ? 'text-coral' : 'text-muted-foreground')}
        />
      ))}
    </div>
  )
}

/* 1. Accueil : grand bouton AIDE */
export function HomeScene() {
  const pressed = useDelayedFlag(2400)
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <div className="flex items-center gap-3 px-5 pt-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground">
          A
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">Bonjour, Aïcha</span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3" aria-hidden />
            Tevragh Zeina, Nouakchott
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="relative flex items-center justify-center">
          <span className="absolute h-44 w-44 rounded-full bg-coral/15 motion-safe:animate-ping" />
          <span className="absolute h-40 w-40 rounded-full bg-coral/20" />
          <span
            className={cn(
              'relative flex h-32 w-32 items-center justify-center rounded-full bg-coral font-display text-3xl font-semibold uppercase tracking-wider text-white shadow-[0_0_40px_rgba(255,107,74,0.55)] transition-transform duration-200',
              pressed && 'scale-90',
            )}
          >
            Aide
          </span>
          {pressed && <TapIndicator className="h-7 w-7" />}
        </div>
        <p className="max-w-[200px] text-center text-xs leading-relaxed text-muted-foreground">
          Appuyez pour alerter vos voisins proches
        </p>
      </div>
      <BottomNav />
    </div>
  )
}

/* 2. Choix du type d'urgence */
export function TypeScene() {
  const selected = useDelayedFlag(1600)
  const types = [
    { id: 'malaise', label: 'Malaise', icon: HeartPulse },
    { id: 'incendie', label: 'Incendie', icon: Flame },
    { id: 'agression', label: 'Agression', icon: ShieldAlert },
    { id: 'accident', label: 'Accident', icon: CarFront },
  ]
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <div className="flex flex-col gap-1 px-5 pt-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-coral">Étape 1 / 2</span>
        <h3 className="font-display text-xl font-semibold uppercase text-foreground">
          {"Quelle est l'urgence ?"}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3 px-5 pt-5">
        {types.map(({ id, label, icon: Icon }) => {
          const active = selected && id === 'malaise'
          return (
            <div
              key={id}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border bg-card transition-all duration-300',
                active ? 'scale-[1.03] border-coral bg-coral/15' : 'border-border',
              )}
            >
              <Icon className={cn('h-7 w-7', active ? 'text-coral' : 'text-muted-foreground')} aria-hidden />
              <span className="text-xs font-semibold text-foreground">{label}</span>
              {id === 'malaise' && selected && <TapIndicator className="h-7 w-7" />}
            </div>
          )
        })}
      </div>
      <div className="mt-auto px-5 pb-6">
        <div
          className={cn(
            'flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-colors duration-300',
            selected ? 'bg-coral text-white' : 'bg-secondary text-muted-foreground',
          )}
        >
          {"Envoyer l'alerte"}
        </div>
      </div>
    </div>
  )
}

/* 3. Diffusion de l'alerte */
const NEIGHBOR_DOTS = [
  { top: '22%', left: '30%' },
  { top: '30%', left: '72%' },
  { top: '55%', left: '18%' },
  { top: '68%', left: '64%' },
  { top: '40%', left: '50%' },
  { top: '75%', left: '38%' },
  { top: '18%', left: '58%' },
  { top: '50%', left: '82%' },
]

export function BroadcastScene() {
  const count = useCountTo(8, 0, 2600)
  const contactNotified = useDelayedFlag(2800)
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <div className="flex flex-col items-center gap-1 px-5 pt-4 text-center">
        <span className="rounded-full bg-coral/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-coral">
          Alerte en cours
        </span>
        <h3 className="mt-2 font-display text-xl font-semibold uppercase text-foreground">Malaise</h3>
      </div>

      <div className="relative mx-auto mt-4 aspect-square w-[85%]">
        {[0, 600, 1200].map((delay) => (
          <span
            key={delay}
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-coral/50 motion-safe:animate-ping"
            style={{ animationDelay: `${delay}ms`, animationDuration: '2s' }}
          />
        ))}
        <span className="absolute inset-[15%] rounded-full border border-coral/20" aria-hidden />
        <span className="absolute inset-[32%] rounded-full border border-coral/20" aria-hidden />
        {NEIGHBOR_DOTS.slice(0, count).map((pos, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-success shadow-[0_0_10px_rgba(74,222,128,0.7)] animate-in fade-in zoom-in duration-300"
            style={pos}
          />
        ))}
        <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-coral shadow-[0_0_24px_rgba(255,107,74,0.7)]">
          <HeartPulse className="h-5 w-5 text-white" aria-hidden />
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-2 px-5 pb-6">
        <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3">
          <span className="text-xs text-muted-foreground">Voisins alertés</span>
          <span className="font-display text-lg font-semibold text-foreground">{count}</span>
        </div>
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl bg-card px-4 py-3 text-xs transition-opacity duration-300',
            contactNotified ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Check className="h-4 w-4 text-success" aria-hidden />
          <span className="text-foreground">{"Contact d'urgence prévenu : Maman"}</span>
        </div>
      </div>
    </div>
  )
}

/* 4. Notification chez le voisin */
export function NotifyScene() {
  const accepted = useDelayedFlag(2400)
  return (
    <div className="flex h-full flex-col bg-[radial-gradient(circle_at_50%_0%,rgba(255,107,74,0.18),transparent_60%)]">
      <StatusBar time="14:33" />
      <div className="flex flex-col items-center pt-6">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Téléphone de Mohamed</span>
        <span className="font-display text-5xl font-semibold text-foreground">14:33</span>
        <span className="text-xs text-muted-foreground">Mardi 10 avril</span>
      </div>

      <div className="px-4 pt-8">
        <div className="animate-in slide-in-from-top-6 fade-in rounded-2xl border border-white/10 bg-card/95 p-4 shadow-xl duration-500">
          <div className="flex items-center gap-2">
            <Image src="/logo.jpeg" alt="" width={20} height={20} className="h-5 w-5 rounded-md" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Rijal Lghayth · maintenant
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-foreground">Alerte : malaise à 350 m</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {"Aïcha a besoin d'aide à Tevragh Zeina. Pouvez-vous intervenir ?"}
          </p>
          <div className="mt-3 flex gap-2">
            <span
              className={cn(
                'relative flex h-10 flex-1 items-center justify-center rounded-xl text-sm font-semibold transition-colors duration-300',
                accepted ? 'bg-success text-success-foreground' : 'bg-coral text-white',
              )}
            >
              {accepted ? 'Itinéraire…' : "J'arrive"}
              {accepted && <TapIndicator className="h-7 w-7" />}
            </span>
            <span className="flex h-10 flex-1 items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-muted-foreground">
              Ignorer
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* 5. Suivi en temps reel */
export function EnrouteScene() {
  const moving = useDelayedFlag(80)
  const distance = useCountTo(20, 350, 4200)
  const eta = distance > 230 ? 3 : distance > 100 ? 2 : 1
  return (
    <div className="flex h-full flex-col">
      <StatusBar time="14:34" />
      <div
        className="relative flex-1 overflow-hidden bg-[#121a1f]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      >
        <span aria-hidden className="absolute left-0 right-0 top-[38%] h-3 bg-white/10" />
        <span aria-hidden className="absolute bottom-0 top-0 left-[22%] w-3 bg-white/10" />
        <span aria-hidden className="absolute bottom-0 top-0 left-[66%] w-2 bg-white/[0.07]" />
        <span aria-hidden className="absolute left-0 right-0 top-[72%] h-2 bg-white/[0.07]" />
        <span aria-hidden className="absolute left-[40%] top-[10%] h-16 w-20 rounded-lg bg-success/10" />

        <svg aria-hidden className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline
            points="23,82 23,39 66,39 66,30"
            fill="none"
            stroke="rgba(255,107,74,0.6)"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <span className="absolute left-[66%] top-[30%] -translate-x-1/2 -translate-y-1/2" aria-hidden>
          <span className="absolute -inset-3 rounded-full bg-coral/30 motion-safe:animate-ping" />
          <span className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-coral" />
        </span>

        <span
          aria-hidden
          className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-success text-[11px] font-bold text-success-foreground shadow-lg transition-all ease-in-out"
          style={{
            left: moving ? '63%' : '23%',
            top: moving ? '36%' : '82%',
            transitionDuration: '4200ms',
          }}
        >
          M
        </span>
      </div>

      <div className="flex flex-col gap-3 rounded-t-3xl bg-card px-5 pb-6 pt-4">
        <span className="mx-auto h-1 w-10 rounded-full bg-border" aria-hidden />
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20 text-sm font-semibold text-success">
            M
          </span>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-semibold text-foreground">Mohamed arrive</span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              Voisin vérifié · 4,9
              <Star className="h-3 w-3 fill-current text-coral" aria-label="étoiles" />
            </span>
          </div>
          <Navigation className="h-5 w-5 text-success" aria-hidden />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col rounded-xl bg-secondary px-3 py-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Distance</span>
            <span className="font-display text-lg font-semibold tabular-nums text-foreground">{distance} m</span>
          </div>
          <div className="flex flex-col rounded-xl bg-secondary px-3 py-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Arrivée</span>
            <span className="font-display text-lg font-semibold tabular-nums text-foreground">{eta} min</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* 6. Aide arrivee */
export function SafeScene() {
  const confirmed = useDelayedFlag(1800)
  return (
    <div className="flex h-full flex-col">
      <StatusBar time="14:36" />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="relative flex items-center justify-center">
          <span className="absolute h-28 w-28 rounded-full bg-success/15 motion-safe:animate-ping" />
          <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success animate-in zoom-in duration-500">
            <ShieldCheck className="h-12 w-12 text-success-foreground" aria-hidden />
          </span>
        </div>
        <h3 className="font-display text-2xl font-semibold uppercase text-foreground">Mohamed est arrivé</h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {"L'aide est sur place. Vos voisins ont été informés."}
        </p>
        <div className="grid w-full grid-cols-3 gap-2 pt-2">
          {[
            { value: '8', label: 'alertés' },
            { value: '1', label: 'a répondu' },
            { value: '4 min', label: 'délai' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col rounded-xl bg-card px-2 py-2">
              <span className="font-display text-base font-semibold text-foreground">{stat.value}</span>
              <span className="text-[10px] text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 pb-6">
        <div
          className={cn(
            'relative flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors duration-300',
            confirmed ? 'bg-success text-success-foreground' : 'bg-secondary text-foreground',
          )}
        >
          {confirmed && <Check className="h-4 w-4" aria-hidden />}
          {confirmed ? 'Alerte clôturée' : 'Je suis en sécurité'}
          {confirmed && <TapIndicator className="h-7 w-7" />}
        </div>
      </div>
    </div>
  )
}
