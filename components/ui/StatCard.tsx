import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color?: string
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'text-blue-400' }: StatCardProps) {
  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700/50 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-400 truncate">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-white tracking-tight">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-700/60 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
