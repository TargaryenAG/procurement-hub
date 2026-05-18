'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, LayoutDashboard, ClipboardList, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/orders', icon: ClipboardList, label: 'Pedidos de Compra' },
  { href: '/vendors', icon: Building2, label: 'Fornecedores' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-900 border-r border-slate-700/50 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/50">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-tight">Procurement Hub</p>
          <p className="text-xs text-slate-400">Gestão de Compras</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500 pl-[10px]'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-l-2 border-transparent pl-[10px]'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500">v1.0.0</p>
      </div>
    </aside>
  )
}
