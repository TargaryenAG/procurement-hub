import Link from 'next/link'
import { Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatBRL, formatDate, getPriorityLabel, getPriorityColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

const STATUS_FILTERS = [
  { label: 'Todos', value: '' },
  { label: 'Rascunho', value: 'DRAFT' },
  { label: 'Pendente', value: 'PENDING' },
  { label: 'Aprovado', value: 'APPROVED' },
  { label: 'Rejeitado', value: 'REJECTED' },
  { label: 'Concluído', value: 'COMPLETED' },
]

interface OrdersPageProps {
  searchParams: { status?: string }
}

async function getOrders(status?: string) {
  try {
    return await prisma.purchaseOrder.findMany({
      where: status ? { status } : undefined,
      include: { vendor: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const activeStatus = searchParams.status ?? ''
  const orders = await getOrders(activeStatus || undefined)

  return (
    <div className="min-h-full bg-slate-900 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pedidos de Compra</h1>
          <p className="mt-1 text-sm text-slate-400">{orders.length} pedido(s) encontrado(s)</p>
        </div>
        <Link
          href="/orders/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Pedido
        </Link>
      </div>

      {/* Status Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ label, value }) => (
          <Link
            key={value}
            href={value ? `/orders?status=${value}` : '/orders'}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              activeStatus === value
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/50'
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-slate-800 border border-slate-700/50">
        {orders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-slate-400 text-sm">Nenhum pedido encontrado.</p>
            {activeStatus && (
              <p className="text-slate-500 text-xs mt-1">
                Tente remover o filtro ou criar um novo pedido.
              </p>
            )}
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
                    Prioridade
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
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-blue-400 whitespace-nowrap">
                      {order.poNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-200 max-w-[220px]">
                      <span className="truncate block">{order.title}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">
                      {order.vendor.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-200 text-right whitespace-nowrap">
                      {formatBRL(order.totalValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border',
                          getPriorityColor(order.priority)
                        )}
                      >
                        {getPriorityLabel(order.priority)}
                      </span>
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
