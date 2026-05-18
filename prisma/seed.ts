import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.purchaseOrder.deleteMany()
  await prisma.vendor.deleteMany()

  // Create vendors
  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        name: 'Aço Paulista Ltda',
        cnpj: '12.345.678/0001-90',
        email: 'comercial@acopaulista.com.br',
        phone: '(11) 3456-7890',
        category: 'Materiais',
        rating: 4.5,
        status: 'ACTIVE',
      },
    }),
    prisma.vendor.create({
      data: {
        name: 'Tech Solutions Brasil',
        cnpj: '23.456.789/0001-01',
        email: 'vendas@techsolutionsbr.com.br',
        phone: '(21) 4567-8901',
        category: 'Tecnologia',
        rating: 4.8,
        status: 'ACTIVE',
      },
    }),
    prisma.vendor.create({
      data: {
        name: 'Logística Express S.A.',
        cnpj: '34.567.890/0001-12',
        email: 'operacoes@logexpress.com.br',
        phone: '(31) 5678-9012',
        category: 'Logística',
        rating: 3.9,
        status: 'ACTIVE',
      },
    }),
    prisma.vendor.create({
      data: {
        name: 'Construções Nobre Engenharia',
        cnpj: '45.678.901/0001-23',
        email: 'obras@nobreeng.com.br',
        phone: '(41) 6789-0123',
        category: 'Serviços',
        rating: 4.2,
        status: 'ACTIVE',
      },
    }),
    prisma.vendor.create({
      data: {
        name: 'Químicos Industriais do Sul',
        cnpj: '56.789.012/0001-34',
        email: 'comercial@quimicossul.com.br',
        phone: '(51) 7890-1234',
        category: 'Químicos',
        rating: 3.7,
        status: 'INACTIVE',
      },
    }),
  ])

  const [acoPaulista, techSolutions, logExpress, nobreEng, quimicosSul] = vendors

  // Create purchase orders
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const nextTwoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

  await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-0001',
      title: 'Aquisição de Chapas de Aço Carbono',
      description: 'Compra de chapas de aço carbono para linha de produção da planta São Paulo.',
      totalValue: 87500.0,
      currency: 'BRL',
      status: 'COMPLETED',
      priority: 'HIGH',
      requestedBy: 'Carlos Mendes',
      approvedBy: 'Diretora Ana Lima',
      dueDate: fiveDaysAgo,
      vendorId: acoPaulista.id,
      items: {
        create: [
          { description: 'Chapa Aço Carbono 3mm 1500x3000', quantity: 200, unitPrice: 350.0, unit: 'un' },
          { description: 'Chapa Aço Carbono 6mm 1500x3000', quantity: 50, unitPrice: 175.0, unit: 'un' },
        ],
      },
    },
  })

  await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-0002',
      title: 'Renovação de Infraestrutura de Servidores',
      description: 'Upgrade do parque de servidores do datacenter central.',
      totalValue: 245000.0,
      currency: 'BRL',
      status: 'APPROVED',
      priority: 'CRITICAL',
      requestedBy: 'Rafael Torres',
      approvedBy: 'Diretor Pedro Alves',
      dueDate: nextWeek,
      vendorId: techSolutions.id,
      items: {
        create: [
          { description: 'Servidor Dell PowerEdge R750', quantity: 4, unitPrice: 48000.0, unit: 'un' },
          { description: 'Switch Cisco Catalyst 9300', quantity: 2, unitPrice: 18500.0, unit: 'un' },
          { description: 'Instalação e Configuração', quantity: 1, unitPrice: 12000.0, unit: 'sv' },
        ],
      },
    },
  })

  await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-0003',
      title: 'Contrato de Transporte e Distribuição Q2',
      description: 'Serviços de transporte para distribuição de produtos no sudeste do Brasil.',
      totalValue: 63200.0,
      currency: 'BRL',
      status: 'PENDING',
      priority: 'MEDIUM',
      requestedBy: 'Juliana Costa',
      dueDate: nextTwoWeeks,
      vendorId: logExpress.id,
      items: {
        create: [
          { description: 'Frete FTL SP-RJ (mensal)', quantity: 8, unitPrice: 4500.0, unit: 'vg' },
          { description: 'Frete LTL Interior SP (mensal)', quantity: 12, unitPrice: 1850.0, unit: 'vg' },
          { description: 'Seguro de Carga', quantity: 1, unitPrice: 3400.0, unit: 'sv' },
        ],
      },
    },
  })

  await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-0004',
      title: 'Reforma do Galpão Industrial B',
      description: 'Obras de reforma e ampliação do galpão industrial B da unidade Campinas.',
      totalValue: 380000.0,
      currency: 'BRL',
      status: 'PENDING',
      priority: 'HIGH',
      requestedBy: 'Marcos Souza',
      dueDate: nextMonth,
      vendorId: nobreEng.id,
      items: {
        create: [
          { description: 'Serviços de Engenharia Civil', quantity: 1, unitPrice: 120000.0, unit: 'sv' },
          { description: 'Materiais de Construção', quantity: 1, unitPrice: 180000.0, unit: 'lp' },
          { description: 'Instalações Elétricas', quantity: 1, unitPrice: 55000.0, unit: 'sv' },
          { description: 'Pintura Industrial', quantity: 1, unitPrice: 25000.0, unit: 'sv' },
        ],
      },
    },
  })

  await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-0005',
      title: 'Reagentes Laboratoriais Semestral',
      description: 'Aquisição de reagentes e insumos para laboratório de controle de qualidade.',
      totalValue: 28750.0,
      currency: 'BRL',
      status: 'REJECTED',
      priority: 'LOW',
      requestedBy: 'Fernanda Rocha',
      dueDate: twoDaysAgo,
      vendorId: quimicosSul.id,
      items: {
        create: [
          { description: 'Ácido Clorídrico P.A. 37%', quantity: 100, unitPrice: 85.0, unit: 'lt' },
          { description: 'Hidróxido de Sódio P.A.', quantity: 80, unitPrice: 120.0, unit: 'kg' },
          { description: 'Etanol Absoluto P.A.', quantity: 60, unitPrice: 195.0, unit: 'lt' },
        ],
      },
    },
  })

  await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-0006',
      title: 'Licenças de Software ERP Módulos Adicionais',
      description: 'Aquisição de licenças para módulos adicionais do sistema ERP corporativo.',
      totalValue: 98000.0,
      currency: 'BRL',
      status: 'DRAFT',
      priority: 'MEDIUM',
      requestedBy: 'Gustavo Faria',
      dueDate: nextMonth,
      vendorId: techSolutions.id,
      items: {
        create: [
          { description: 'Licença Módulo RH (anual)', quantity: 1, unitPrice: 45000.0, unit: 'un' },
          { description: 'Licença Módulo BI (anual)', quantity: 1, unitPrice: 38000.0, unit: 'un' },
          { description: 'Suporte Premium (anual)', quantity: 1, unitPrice: 15000.0, unit: 'sv' },
        ],
      },
    },
  })

  await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-0007',
      title: 'Parafusos e Fixadores para Linha A',
      description: 'Reposição de estoque de fixadores para linha de montagem A.',
      totalValue: 12400.0,
      currency: 'BRL',
      status: 'APPROVED',
      priority: 'LOW',
      requestedBy: 'Roberto Lima',
      approvedBy: 'Supervisora Carla Dias',
      dueDate: nextWeek,
      vendorId: acoPaulista.id,
      items: {
        create: [
          { description: 'Parafuso M8 x 25 Zincado', quantity: 5000, unitPrice: 0.85, unit: 'un' },
          { description: 'Parafuso M10 x 30 Inox', quantity: 3000, unitPrice: 1.20, unit: 'un' },
          { description: 'Porca Sextavada M8', quantity: 5000, unitPrice: 0.45, unit: 'un' },
          { description: 'Arruela Plana M10', quantity: 4000, unitPrice: 0.30, unit: 'un' },
        ],
      },
    },
  })

  await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-0008',
      title: 'Treinamento em Segurança do Trabalho NR-12',
      description: 'Capacitação de operadores em normas de segurança NR-12 (máquinas e equipamentos).',
      totalValue: 18600.0,
      currency: 'BRL',
      status: 'COMPLETED',
      priority: 'HIGH',
      requestedBy: 'Amanda Silveira',
      approvedBy: 'Diretor Pedro Alves',
      dueDate: tenDaysAgo,
      vendorId: nobreEng.id,
      items: {
        create: [
          { description: 'Treinamento NR-12 (40h) - Turma 1', quantity: 20, unitPrice: 450.0, unit: 'px' },
          { description: 'Treinamento NR-12 (40h) - Turma 2', quantity: 18, unitPrice: 450.0, unit: 'px' },
          { description: 'Material Didático', quantity: 38, unitPrice: 35.0, unit: 'un' },
        ],
      },
    },
  })

  await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-0009',
      title: 'Frota de Empilhadeiras - Locação Mensal',
      description: 'Locação de empilhadeiras elétricas para o armazém de produto acabado.',
      totalValue: 22800.0,
      currency: 'BRL',
      status: 'DRAFT',
      priority: 'MEDIUM',
      requestedBy: 'Sílvio Nunes',
      dueDate: nextTwoWeeks,
      vendorId: logExpress.id,
      items: {
        create: [
          { description: 'Empilhadeira Elétrica 2t - Locação Mensal', quantity: 3, unitPrice: 4800.0, unit: 'un' },
          { description: 'Manutenção Preventiva Mensal', quantity: 3, unitPrice: 800.0, unit: 'sv' },
          { description: 'Seguro e Responsabilidade Civil', quantity: 1, unitPrice: 2400.0, unit: 'sv' },
        ],
      },
    },
  })

  await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-0010',
      title: 'Equipamentos de Proteção Individual (EPIs)',
      description: 'Aquisição semestral de EPIs para colaboradores da área de produção.',
      totalValue: 34500.0,
      currency: 'BRL',
      status: 'PENDING',
      priority: 'HIGH',
      requestedBy: 'Patrícia Mendonça',
      dueDate: nextWeek,
      vendorId: acoPaulista.id,
      items: {
        create: [
          { description: 'Capacete de Segurança CA 31469', quantity: 150, unitPrice: 42.0, unit: 'un' },
          { description: 'Óculos de Proteção Ampla Visão', quantity: 200, unitPrice: 28.0, unit: 'un' },
          { description: 'Luva de Segurança Nitrílica', quantity: 500, unitPrice: 18.5, unit: 'pr' },
          { description: 'Botina de Segurança Bico de Aço', quantity: 100, unitPrice: 125.0, unit: 'pr' },
          { description: 'Protetor Auricular Plug', quantity: 1000, unitPrice: 3.5, unit: 'un' },
        ],
      },
    },
  })

  console.log('Database seeded successfully!')
  console.log(`Created ${vendors.length} vendors and 10 purchase orders.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
