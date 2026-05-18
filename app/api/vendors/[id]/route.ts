import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: { id: string }
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: params.id },
      include: { orders: { orderBy: { createdAt: 'desc' } } },
    })

    if (!vendor) {
      return NextResponse.json({ error: 'Fornecedor não encontrado.' }, { status: 404 })
    }

    return NextResponse.json(vendor)
  } catch (error) {
    console.error(`GET /api/vendors/${params.id} error:`, error)
    return NextResponse.json({ error: 'Erro ao buscar fornecedor.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const body = await req.json()
    const { name, cnpj, email, phone, category, rating, status } = body as {
      name?: string
      cnpj?: string
      email?: string
      phone?: string
      category?: string
      rating?: number
      status?: string
    }

    const vendor = await prisma.vendor.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(cnpj !== undefined && { cnpj }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(category !== undefined && { category }),
        ...(rating !== undefined && { rating }),
        ...(status !== undefined && { status }),
      },
    })

    return NextResponse.json(vendor)
  } catch (error) {
    console.error(`PUT /api/vendors/${params.id} error:`, error)
    return NextResponse.json({ error: 'Erro ao atualizar fornecedor.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await prisma.vendor.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`DELETE /api/vendors/${params.id} error:`, error)
    return NextResponse.json({ error: 'Erro ao excluir fornecedor.' }, { status: 500 })
  }
}
