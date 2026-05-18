import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700 border-gray-200',
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    APPROVED: 'bg-blue-100 text-blue-700 border-blue-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200',
    COMPLETED: 'bg-green-100 text-green-700 border-green-200',
    ACTIVE: 'bg-green-100 text-green-700 border-green-200',
    INACTIVE: 'bg-gray-100 text-gray-500 border-gray-200',
  }
  return colors[status] ?? 'bg-gray-100 text-gray-700 border-gray-200'
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: 'bg-slate-100 text-slate-600 border-slate-200',
    MEDIUM: 'bg-orange-100 text-orange-700 border-orange-200',
    HIGH: 'bg-red-100 text-red-700 border-red-200',
    CRITICAL: 'bg-purple-100 text-purple-700 border-purple-200',
  }
  return colors[priority] ?? 'bg-slate-100 text-slate-600 border-slate-200'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: 'Rascunho',
    PENDING: 'Aguardando Aprovação',
    APPROVED: 'Aprovado',
    REJECTED: 'Rejeitado',
    COMPLETED: 'Concluído',
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
  }
  return labels[status] ?? status
}

export function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    LOW: 'Baixa',
    MEDIUM: 'Média',
    HIGH: 'Alta',
    CRITICAL: 'Crítica',
  }
  return labels[priority] ?? priority
}
