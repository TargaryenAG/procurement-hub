import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: { id: string }
}

export async function POST(_req: NextRequest, { params }: RouteParams) {
  try {
    const order = await prisma.purchaseOrder.update({
      where: { id: params.id },
      data: {
        status: 'APPROVED',
        approvedBy: 'Admin',
      },
      include: { vendor: true, items: true },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error(`POST /api/orders/${params.id}/approve error:`, error)
    return NextResponse.json({ error: 'Erro ao aprovar pedido.' }, { status: 500 })
  }
}
