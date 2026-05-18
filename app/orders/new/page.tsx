'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Vendor {
  id: string
  name: string
  cnpj: string
}

interface OrderItem {
  description: string
  quantity: number
  unitPrice: number
  unit: string
}

interface FormState {
  title: string
  description: string
  vendorId: string
  priority: string
  requestedBy: string
  dueDate: string
  items: OrderItem[]
}

const initialItem: OrderItem = { description: '', quantity: 1, unitPrice: 0, unit: 'un' }

const initialForm: FormState = {
  title: '',
  description: '',
  vendorId: '',
  priority: 'MEDIUM',
  requestedBy: '',
  dueDate: '',
  items: [{ ...initialItem }],
}

export default function NewOrderPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(initialForm)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/vendors')
      .then((res) => res.json())
      .then((data: Vendor[]) => setVendors(data))
      .catch(() => setVendors([]))
  }, [])

  const total = form.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...initialItem }] }))
  }

  function removeItem(index: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  function updateItem(index: number, field: keyof OrderItem, value: string | number) {
    setForm((prev) => {
      const items = prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
      return { ...prev, items }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.title || !form.vendorId || !form.requestedBy || !form.dueDate) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    if (form.items.length === 0) {
      setError('Adicione pelo menos um item ao pedido.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          totalValue: total,
          items: form.items.map((item) => ({
            ...item,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })),
        }),
      })

      if (!res.ok) {
        throw new Error('Erro ao criar pedido.')
      }

      router.push('/orders')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-full bg-slate-900 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/orders"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Pedidos
        </Link>
        <h1 className="text-2xl font-bold text-white">Novo Pedido de Compra</h1>
        <p className="mt-1 text-sm text-slate-400">Preencha os dados do pedido de compra</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Info */}
        <div className="rounded-xl bg-slate-800 border border-slate-700/50 p-6">
          <h2 className="text-base font-semibold text-white mb-4">Informações Gerais</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Título <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Ex.: Aquisição de Chapas de Aço"
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Descrição
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                placeholder="Detalhes do pedido..."
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Fornecedor <span className="text-red-400">*</span>
              </label>
              <select
                value={form.vendorId}
                onChange={(e) => updateField('vendorId', e.target.value)}
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione um fornecedor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Prioridade
              </label>
              <select
                value={form.priority}
                onChange={(e) => updateField('priority', e.target.value)}
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Solicitado por <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.requestedBy}
                onChange={(e) => updateField('requestedBy', e.target.value)}
                placeholder="Nome do solicitante"
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Data de Vencimento <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => updateField('dueDate', e.target.value)}
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl bg-slate-800 border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Itens do Pedido</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
              Adicionar Item
            </button>
          </div>

          <div className="space-y-3">
            {form.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 items-start p-3 rounded-lg bg-slate-700/50 border border-slate-700"
              >
                <div className="col-span-12 sm:col-span-4">
                  <label className="block text-xs text-slate-400 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Descrição do item"
                    className="w-full rounded-md bg-slate-700 border border-slate-600 px-2.5 py-1.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Qtd.</label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                    className="w-full rounded-md bg-slate-700 border border-slate-600 px-2.5 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Unidade</label>
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                    placeholder="un"
                    className="w-full rounded-md bg-slate-700 border border-slate-600 px-2.5 py-1.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-4 sm:col-span-3">
                  <label className="block text-xs text-slate-400 mb-1">Preço Unitário (R$)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                    className="w-full rounded-md bg-slate-700 border border-slate-600 px-2.5 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-12 sm:col-span-1 flex sm:items-end sm:justify-center sm:pb-0.5">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={form.items.length === 1}
                    className="mt-5 sm:mt-0 rounded-md p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 flex justify-end border-t border-slate-700 pt-4">
            <div className="text-right">
              <p className="text-xs text-slate-400">Total Calculado</p>
              <p className="text-xl font-bold text-white">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/orders"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Criando...' : 'Criar Pedido'}
          </button>
        </div>
      </form>
    </div>
  )
}
