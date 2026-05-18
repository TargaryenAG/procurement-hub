import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(vendors)
  } catch (error) {
    console.error('GET /api/vendors error:', error)
    return NextResponse.json({ error: 'Erro ao buscar fornecedores.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, cnpj, email, phone, category, rating, status } = body as {
      name: string
      cnpj: string
      email: string
      phone: string
      category: string
      rating?: number
      status?: string
    }

    const vendor = await prisma.vendor.create({
      data: {
        name,
        cnpj,
        email,
        phone,
        category,
        rating: rating ?? 0,
        status: status ?? 'ACTIVE',
      },
    })

    return NextResponse.json(vendor, { status: 201 })
  } catch (error) {
    console.error('POST /api/vendors error:', error)
    return NextResponse.json({ error: 'Erro ao criar fornecedor.' }, { status: 500 })
  }
}
