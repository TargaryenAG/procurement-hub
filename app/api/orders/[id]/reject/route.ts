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
        status: 'REJECTED',
      },
      include: { vendor: true, items: true },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error(`POST /api/orders/${params.id}/reject error:`, error)
    return NextResponse.json({ error: 'Erro ao rejeitar pedido.' }, { status: 500 })
  }
}
