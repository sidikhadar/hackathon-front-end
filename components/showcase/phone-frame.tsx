import Image from 'next/image'
import { cn } from '@/lib/utils'

export function PhoneFrame({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  return (
    <div
      className={cn(
        'relative w-full max-w-[260px] rounded-[2.5rem] border border-white/10 bg-[#0a0e11] p-2.5 shadow-2xl shadow-black/60',
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-background">
        <Image
          src={src}
          alt={alt}
          width={390}
          height={844}
          priority={priority}
          className="h-auto w-full"
        />
        <span
          aria-hidden
          className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black/80"
        />
      </div>
    </div>
  )
}
