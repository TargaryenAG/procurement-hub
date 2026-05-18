import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status')
    const orders = await prisma.purchaseOrder.findMany({
      where: status ? { status } : undefined,
      include: { vendor: true, items: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json({ error: 'Erro ao buscar pedidos.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, vendorId, totalValue, priority, requestedBy, dueDate, items } =
      body as {
        title: string
        description?: string
        vendorId: string
        totalValue: number
        priority: string
        requestedBy: string
        dueDate: string
        items: { description: string; quantity: number; unitPrice: number; unit: string }[]
      }

    const order = await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${Date.now()}`,
        title,
        description,
        vendorId,
        totalValue,
        priority,
        requestedBy,
        dueDate: new Date(dueDate),
        status: 'DRAFT',
        items: { create: items },
      },
      include: { vendor: true, items: true },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('POST /api/orders error:', error)
    return NextResponse.json({ error: 'Erro ao criar pedido.' }, { status: 500 })
  }
}
