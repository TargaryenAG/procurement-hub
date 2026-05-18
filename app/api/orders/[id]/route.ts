import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: { id: string }
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id: params.id },
      include: { vendor: true, items: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado.' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error(`GET /api/orders/${params.id} error:`, error)
    return NextResponse.json({ error: 'Erro ao buscar pedido.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const body = await req.json()
    const { title, description, status, priority, requestedBy, dueDate, totalValue } = body as {
      title?: string
      description?: string
      status?: string
      priority?: string
      requestedBy?: string
      dueDate?: string
      totalValue?: number
    }

    const order = await prisma.purchaseOrder.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(requestedBy !== undefined && { requestedBy }),
        ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
        ...(totalValue !== undefined && { totalValue }),
      },
      include: { vendor: true, items: true },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error(`PUT /api/orders/${params.id} error:`, error)
    return NextResponse.json({ error: 'Erro ao atualizar pedido.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await prisma.purchaseOrder.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`DELETE /api/orders/${params.id} error:`, error)
    return NextResponse.json({ error: 'Erro ao excluir pedido.' }, { status: 500 })
  }
}
