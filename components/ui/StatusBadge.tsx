interface StatusBadgeProps {
  status: string
}

const statusStyles: Record<string, string> = {
  DRAFT: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  PENDING: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  APPROVED: 'bg-green-500/20 text-green-400 border border-green-500/30',
  REJECTED: 'bg-red-500/20 text-red-400 border border-red-500/30',
  COMPLETED: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  ACTIVE: 'bg-green-500/20 text-green-400 border border-green-500/30',
  INACTIVE: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Rascunho',
  PENDING: 'Aguardando',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
  COMPLETED: 'Concluído',
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] ?? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  const label = statusLabels[status] ?? status

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${style}`}>
      {label}
    </span>
  )
}
