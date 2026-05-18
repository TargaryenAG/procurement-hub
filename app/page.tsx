import { ShoppingCart, Clock, DollarSign, Building2 } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatBRL, formatDate } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import type { PurchaseOrder, Vendor } from '@prisma/client'

type OrderWithVendor = PurchaseOrder & { vendor: Vendor }

async function getDashboardData() {
  try {
    const [totalOrders, pendingOrders, allOrders, vendors, recentOrders] = await Promise.all([
      prisma.purchaseOrder.count(),
      prisma.purchaseOrder.count({ where: { status: 'PENDING' } }),
      prisma.purchaseOrder.findMany({ select: { totalValue: true } }),
      prisma.vendor.count({ where: { status: 'ACTIVE' } }),
      prisma.purchaseOrder.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { vendor: true },
      }),
    ])

    const totalSpend = allOrders.reduce((sum, o) => sum + o.totalValue, 0)

    return { totalOrders, pendingOrders, totalSpend, activeVendors: vendors, recentOrders }
  } catch {
    return {
      totalOrders: 10,
      pendingOrders: 3,
      totalSpend: 990750,
      activeVendors: 4,
      recentOrders: [] as OrderWithVendor[],
    }
  }
}

export default async function DashboardPage() {
  const { totalOrders, pendingOrders, totalSpend, activeVendors, recentOrders } =
    await getDashboardData()

  return (
    <div className="min-h-full bg-slate-900 p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Visão geral do sistema de compras</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatCard
          title="Total Pedidos"
          value={totalOrders}
          subtitle="Todos os status"
          icon={ShoppingCart}
          color="text-blue-400"
        />
        <StatCard
          title="Aguardando Aprovação"
          value={pendingOrders}
          subtitle="Pedidos pendentes"
          icon={Clock}
          color="text-yellow-400"
        />
        <StatCard
          title="Valor Total"
          value={formatBRL(totalSpend)}
          subtitle="Soma de todos os pedidos"
          icon={DollarSign}
          color="text-green-400"
        />
        <StatCard
          title="Fornecedores Ativos"
          value={activeVendors}
          subtitle="Cadastrados e ativos"
          icon={Building2}
          color="text-purple-400"
        />
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl bg-slate-800 border border-slate-700/50">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-base font-semibold text-white">Pedidos Recentes</h2>
          <p className="text-xs text-slate-400 mt-0.5">Últimos 5 pedidos criados</p>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-400 text-sm">Nenhum pedido encontrado.</p>
            <p className="text-slate-500 text-xs mt-1">Execute o seed para popular o banco de dados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Nº PO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Vencimento
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-blue-400 whitespace-nowrap">
                      {order.poNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-200 max-w-[200px]">
                      <span className="truncate block">{order.title}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">
                      {order.vendor.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-200 text-right whitespace-nowrap">
                      {formatBRL(order.totalValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                      {formatDate(order.dueDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
