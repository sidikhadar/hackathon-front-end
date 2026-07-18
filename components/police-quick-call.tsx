/* ============================================================================
   police-quick-call.tsx — APPEL RAPIDE POLICE (toujours disponible)
   ----------------------------------------------------------------------------
   Carte permanente donnant acces en UN CLIC au numero de la police
   mauritanienne (117). L'utilisateur n'a rien a configurer : c'est integre.
   Le numero est un lien tel: (appel direct) et s'affiche en LTR pour ne pas
   inverser les chiffres, meme en mode arabe.
   ============================================================================ */

'use client'

import { Shield, Phone } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/* Numero d'urgence de la police en Mauritanie */
const POLICE_PHONE = '117'

export function PoliceQuickCall({ className }: { className?: string }) {
  const { t } = useLanguage()

  return (
    <a
      href={`tel:${POLICE_PHONE}`}
      className={cn(
        'flex items-center gap-3 rounded-3xl border border-border bg-card/70 p-3.5 transition-all duration-200 hover:border-white/20 active:scale-[0.99]',
        className,
      )}
    >
      {/* Icone bouclier (police / securite) */}
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#4a9eff]/15 text-[#4a9eff]">
        <Shield className="h-5 w-5" strokeWidth={2.2} />
      </span>

      {/* Libelle + sous-titre */}
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-sm font-semibold text-foreground">
          {t.police.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {t.police.subtitle}
        </p>
      </div>

      {/* Pastille d'appel avec le numero (toujours LTR) */}
      <span
        dir="ltr"
        className="flex items-center gap-1.5 rounded-full bg-[#4a9eff] px-3 py-1.5 text-sm font-bold text-[#031121]"
      >
        <Phone className="h-4 w-4" />
        {POLICE_PHONE}
      </span>
    </a>
  )
}
