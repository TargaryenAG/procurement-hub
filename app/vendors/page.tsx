import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/ui/StatusBadge'

async function getVendors() {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { orders: true } } },
    })
    return vendors
  } catch {
    return []
  }
}

function RatingStars({ rating }: { rating: number }) {
  const rounded = Math.round(rating * 10) / 10
  return (
    <span className="flex items-center gap-1 text-sm">
      <span className="text-yellow-400">★</span>
      <span className="text-slate-300">{rounded.toFixed(1)}/5</span>
    </span>
  )
}

export default async function VendorsPage() {
  const vendors = await getVendors()

  return (
    <div className="min-h-full bg-slate-900 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Fornecedores</h1>
        <p className="mt-1 text-sm text-slate-400">{vendors.length} fornecedor(es) cadastrado(s)</p>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-slate-800 border border-slate-700/50">
        {vendors.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-slate-400 text-sm">Nenhum fornecedor encontrado.</p>
            <p className="text-slate-500 text-xs mt-1">Execute o seed para popular o banco de dados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    CNPJ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Avaliação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Pedidos
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-200">{vendor.name}</p>
                        <p className="text-xs text-slate-500">{vendor.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-300 whitespace-nowrap">
                      {vendor.cnpj}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">
                      {vendor.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RatingStars rating={vendor.rating} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={vendor.status} />
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-slate-300">
                      {vendor._count.orders}
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
