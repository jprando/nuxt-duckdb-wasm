import { describe, expect, it } from 'vitest'

// Consultas — todos os datasets
import {
  diffusionDBAtividadeHorariaConsulta,
  diffusionDBDimensoesConsulta,
  diffusionDBKpisConsulta,
  diffusionDBNsfwConsulta,
  diffusionDBSamplerConsulta,
  diffusionDBStepsConsulta
} from '../../app/consultas/diffusionDB.consultas'
import {
  eletricidadeFinlandiaCalendarioConsulta,
  eletricidadeFinlandiaDistribuicaoConsulta,
  eletricidadeFinlandiaHorariaConsulta,
  eletricidadeFinlandiaKpisConsulta,
  eletricidadeFinlandiaMensalConsulta,
  eletricidadeFinlandiaSemanaisConsulta
} from '../../app/consultas/eletricidadeFinlandia.consultas'
import {
  estacoesTremCategoriasConsulta,
  estacoesTremKpisConsulta,
  estacoesTremLatitudeConsulta,
  estacoesTremLongitudeConsulta,
  estacoesTremPaisesConsulta,
  estacoesTremTiposConsulta,
  estacoesTremTiposPorPaisConsulta
} from '../../app/consultas/estacoesTrem.consultas'
import {
  ontimeAeroportosConsulta,
  ontimeAtrasoPartidaConsulta,
  ontimeCancelamentosConsulta,
  ontimeCompanhiasConsulta,
  ontimeDiaSemanaConsulta,
  ontimeDistanciaConsulta,
  ontimeHoraPartidaConsulta,
  ontimeKpisConsulta,
  ontimeMensalConsulta,
  ontimeRadarCompanhiasConsulta,
  ontimeSankeyConsulta,
  ontimeStatusConsulta
} from '../../app/consultas/pontualidadeVoos.consultas'
import {
  shakespeareAtoConsulta,
  shakespeareComprimentoConsulta,
  shakespeareElencoConsulta,
  shakespeareKpisConsulta,
  shakespearePecasConsulta,
  shakespearePersonagensConsulta
} from '../../app/consultas/shakespeare.consultas'
import {
  railwayFaresBusiestStationsConsulta,
  railwayFaresChordConsulta,
  railwayFaresKpisConsulta,
  railwayFaresMostExpensiveRoutesConsulta,
  railwayFaresPriceDistributionConsulta
} from '../../app/consultas/tarifasFerroviarias.consultas'
import {
  nycTaxi2019AprDuracaoConsulta,
  nycTaxi2019AprGorjetaConsulta,
  nycTaxi2019AprHoraConsulta,
  nycTaxi2019AprKpisConsulta,
  nycTaxi2019AprPagamentoConsulta,
  nycTaxi2019AprTarifaConsulta
} from '../../app/consultas/taxiNYCAbril2019.consultas'
import {
  nycTaxi2010JanDistanciaConsulta,
  nycTaxi2010JanGorjetaConsulta,
  nycTaxi2010JanHoraConsulta,
  nycTaxi2010JanKpisConsulta,
  nycTaxi2010JanPagamentoConsulta,
  nycTaxi2010JanVendorConsulta
} from '../../app/consultas/taxiNYCJaneiro2010.consultas'
import {
  localNYCTaxiDistanciaConsulta,
  localNYCTaxiHoraConsulta,
  localNYCTaxiKpisConsulta,
  localNYCTaxiPassageirosConsulta,
  localNYCTaxiVendorConsulta
} from '../../app/consultas/taxiNYCLocal.consultas'
import {
  dutchTrainServicesAvgStopDurationConsulta,
  dutchTrainServicesBusiestStationsConsulta,
  dutchTrainServicesDeparturesByHourConsulta,
  dutchTrainServicesKpisConsulta,
  dutchTrainServicesTypeConsulta
} from '../../app/consultas/trensHolandeses.consultas'

const ARQUIVO = 'dados.parquet'

// Coleção de TODAS as funções de consulta para testes genéricos
const todasConsultas: Array<{ nome: string, fn: (url: string) => string }> = [
  // Trens Holandeses
  { nome: 'dutchTrainServicesKpis', fn: dutchTrainServicesKpisConsulta },
  { nome: 'dutchTrainServicesType', fn: dutchTrainServicesTypeConsulta },
  { nome: 'dutchTrainServicesBusiestStations', fn: dutchTrainServicesBusiestStationsConsulta },
  { nome: 'dutchTrainServicesDeparturesByHour', fn: dutchTrainServicesDeparturesByHourConsulta },
  { nome: 'dutchTrainServicesAvgStopDuration', fn: dutchTrainServicesAvgStopDurationConsulta },
  // Tarifas Ferroviárias
  { nome: 'railwayFaresKpis', fn: railwayFaresKpisConsulta },
  { nome: 'railwayFaresPriceDistribution', fn: railwayFaresPriceDistributionConsulta },
  { nome: 'railwayFaresMostExpensiveRoutes', fn: railwayFaresMostExpensiveRoutesConsulta },
  { nome: 'railwayFaresBusiestStations', fn: railwayFaresBusiestStationsConsulta },
  { nome: 'railwayFaresChord', fn: railwayFaresChordConsulta },
  // Estações de Trem
  { nome: 'estacoesTremKpis', fn: estacoesTremKpisConsulta },
  { nome: 'estacoesTremPaises', fn: estacoesTremPaisesConsulta },
  { nome: 'estacoesTremTipos', fn: estacoesTremTiposConsulta },
  { nome: 'estacoesTremCategorias', fn: estacoesTremCategoriasConsulta },
  { nome: 'estacoesTremLatitude', fn: estacoesTremLatitudeConsulta },
  { nome: 'estacoesTremLongitude', fn: estacoesTremLongitudeConsulta },
  { nome: 'estacoesTremTiposPorPais', fn: estacoesTremTiposPorPaisConsulta },
  // Pontualidade de Voos
  { nome: 'ontimeKpis', fn: ontimeKpisConsulta },
  { nome: 'ontimeCompanhias', fn: ontimeCompanhiasConsulta },
  { nome: 'ontimeStatus', fn: ontimeStatusConsulta },
  { nome: 'ontimeDiaSemana', fn: ontimeDiaSemanaConsulta },
  { nome: 'ontimeMensal', fn: ontimeMensalConsulta },
  { nome: 'ontimeAtrasoPartida', fn: ontimeAtrasoPartidaConsulta },
  { nome: 'ontimeDistancia', fn: ontimeDistanciaConsulta },
  { nome: 'ontimeAeroportos', fn: ontimeAeroportosConsulta },
  { nome: 'ontimeCancelamentos', fn: ontimeCancelamentosConsulta },
  { nome: 'ontimeHoraPartida', fn: ontimeHoraPartidaConsulta },
  { nome: 'ontimeRadarCompanhias', fn: ontimeRadarCompanhiasConsulta },
  { nome: 'ontimeSankey', fn: ontimeSankeyConsulta },
  // Shakespeare
  { nome: 'shakespeareKpis', fn: shakespeareKpisConsulta },
  { nome: 'shakespearePecas', fn: shakespearePecasConsulta },
  { nome: 'shakespearePersonagens', fn: shakespearePersonagensConsulta },
  { nome: 'shakespeareAto', fn: shakespeareAtoConsulta },
  { nome: 'shakespeareElenco', fn: shakespeareElencoConsulta },
  { nome: 'shakespeareComprimento', fn: shakespeareComprimentoConsulta },
  // Taxi NYC Abr/2019
  { nome: 'nycTaxi2019AprKpis', fn: nycTaxi2019AprKpisConsulta },
  { nome: 'nycTaxi2019AprTarifa', fn: nycTaxi2019AprTarifaConsulta },
  { nome: 'nycTaxi2019AprPagamento', fn: nycTaxi2019AprPagamentoConsulta },
  { nome: 'nycTaxi2019AprDuracao', fn: nycTaxi2019AprDuracaoConsulta },
  { nome: 'nycTaxi2019AprGorjeta', fn: nycTaxi2019AprGorjetaConsulta },
  { nome: 'nycTaxi2019AprHora', fn: nycTaxi2019AprHoraConsulta },
  // Taxi NYC Jan/2010
  { nome: 'nycTaxi2010JanKpis', fn: nycTaxi2010JanKpisConsulta },
  { nome: 'nycTaxi2010JanVendor', fn: nycTaxi2010JanVendorConsulta },
  { nome: 'nycTaxi2010JanPagamento', fn: nycTaxi2010JanPagamentoConsulta },
  { nome: 'nycTaxi2010JanDistancia', fn: nycTaxi2010JanDistanciaConsulta },
  { nome: 'nycTaxi2010JanGorjeta', fn: nycTaxi2010JanGorjetaConsulta },
  { nome: 'nycTaxi2010JanHora', fn: nycTaxi2010JanHoraConsulta },
  // DiffusionDB
  { nome: 'diffusionDBKpis', fn: diffusionDBKpisConsulta },
  { nome: 'diffusionDBDimensoes', fn: diffusionDBDimensoesConsulta },
  { nome: 'diffusionDBNsfw', fn: diffusionDBNsfwConsulta },
  { nome: 'diffusionDBSteps', fn: diffusionDBStepsConsulta },
  { nome: 'diffusionDBSampler', fn: diffusionDBSamplerConsulta },
  { nome: 'diffusionDBAtividadeHoraria', fn: diffusionDBAtividadeHorariaConsulta },
  // Eletricidade Finlândia
  { nome: 'eletricidadeFinlandiaKpis', fn: eletricidadeFinlandiaKpisConsulta },
  { nome: 'eletricidadeFinlandiaMensal', fn: eletricidadeFinlandiaMensalConsulta },
  { nome: 'eletricidadeFinlandiaHoraria', fn: eletricidadeFinlandiaHorariaConsulta },
  { nome: 'eletricidadeFinlandiaSemanais', fn: eletricidadeFinlandiaSemanaisConsulta },
  { nome: 'eletricidadeFinlandiaDistribuicao', fn: eletricidadeFinlandiaDistribuicaoConsulta },
  { nome: 'eletricidadeFinlandiaCalendario', fn: eletricidadeFinlandiaCalendarioConsulta },
  // Taxi NYC Local
  { nome: 'localNYCTaxiKpis', fn: localNYCTaxiKpisConsulta },
  { nome: 'localNYCTaxiVendor', fn: localNYCTaxiVendorConsulta },
  { nome: 'localNYCTaxiPassageiros', fn: localNYCTaxiPassageirosConsulta },
  { nome: 'localNYCTaxiDistancia', fn: localNYCTaxiDistanciaConsulta },
  { nome: 'localNYCTaxiHora', fn: localNYCTaxiHoraConsulta }
]

describe('consultas — validação estrutural universal', () => {
  it.each(todasConsultas)(
    '$nome: retorna string não-vazia contendo o arquivo parametrizado',
    ({ fn }) => {
      const sql = fn(ARQUIVO)
      expect(typeof sql).toBe('string')
      expect(sql.trim().length).toBeGreaterThan(0)
      expect(sql).toContain(ARQUIVO)
    }
  )

  it.each(todasConsultas)(
    '$nome: referencia o arquivo entre aspas simples',
    ({ fn }) => {
      const sql = fn(ARQUIVO)
      expect(sql).toContain(`'${ARQUIVO}'`)
    }
  )

  it.each(todasConsultas)(
    '$nome: não contém template literals não-resolvidos (${\'{\'} ou ${\'}\'})',
    ({ fn }) => {
      const sql = fn(ARQUIVO)
      expect(sql).not.toContain('${')
    }
  )
})

describe('consultas KPI — todos os datasets possuem alguma agregação COUNT', () => {
  const consultasKpi = todasConsultas.filter(c => c.nome.includes('Kpis'))

  it.each(consultasKpi)(
    '$nome: contém COUNT(...) para totais',
    ({ fn }) => {
      const sql = fn(ARQUIVO).toUpperCase()
      // Aceita COUNT(*) ou COUNT(DISTINCT ...) — ambos válidos para KPIs
      expect(sql).toMatch(/COUNT\s*\(/)
    }
  )
})

describe('consultas com agrupamento — possuem GROUP BY', () => {
  const consultasComAgrupamento = todasConsultas.filter(
    c => !c.nome.includes('Kpis') && !c.nome.includes('MostExpensive')
  )

  it.each(consultasComAgrupamento)(
    '$nome: contém GROUP BY',
    ({ fn }) => {
      const sql = fn(ARQUIVO)
      expect(sql.toUpperCase()).toContain('GROUP BY')
    }
  )
})

describe('consultas com CTE — usam WITH corretamente', () => {
  it('railwayFaresKpis usa CTE com UNION', () => {
    const sql = railwayFaresKpisConsulta(ARQUIVO)
    expect(sql.toUpperCase()).toContain('WITH')
    expect(sql.toUpperCase()).toContain('UNION')
  })

  it('railwayFaresChord usa CTE para top_stations', () => {
    const sql = railwayFaresChordConsulta(ARQUIVO)
    expect(sql.toUpperCase()).toContain('WITH TOP_STATIONS')
    expect(sql.toUpperCase()).toContain('LEAST')
    expect(sql.toUpperCase()).toContain('GREATEST')
  })

  it('dutchTrainServicesAvgStopDuration usa CTE com JOIN', () => {
    const sql = dutchTrainServicesAvgStopDurationConsulta(ARQUIVO)
    expect(sql.toUpperCase()).toContain('WITH')
    expect(sql.toUpperCase()).toContain('JOIN')
  })
})

describe('consultas com CASE — mapeamento de códigos', () => {
  it('nycTaxi2019AprTarifa mapeia 6 tipos de Rate_code_id', () => {
    const sql = nycTaxi2019AprTarifaConsulta(ARQUIVO)
    expect(sql).toContain('WHEN 1 THEN')
    expect(sql).toContain('WHEN 6 THEN')
    expect(sql).toContain('ELSE')
    expect(sql).toContain('Padrão')
    expect(sql).toContain('JFK')
  })

  it('ontimeStatus classifica em 4 categorias (Cancelado, Desviado, Atrasado, Pontual)', () => {
    const sql = ontimeStatusConsulta(ARQUIVO)
    expect(sql).toContain('Cancelado')
    expect(sql).toContain('Desviado')
    expect(sql).toContain('Atrasado (>15min)')
    expect(sql).toContain('Pontual')
  })

  it('estacoesTremCategorias traduz 6 tipos de estação', () => {
    const sql = estacoesTremCategoriasConsulta(ARQUIVO)
    expect(sql).toContain('Mega Estação')
    expect(sql).toContain('Intercidade')
    expect(sql).toContain('Parada Local')
    expect(sql).toContain('Trem Rápido')
  })

  it('diffusionDBSampler mapeia 8 códigos de sampler', () => {
    const sql = diffusionDBSamplerConsulta(ARQUIVO)
    expect(sql).toContain('k_lms')
    expect(sql).toContain('k_euler_a')
    expect(sql).toContain('plms')
    expect(sql).toContain('k_dpm_2_a')
  })
})

describe('consultas com HAVING — filtros pós-agrupamento', () => {
  it('ontimeRadarCompanhias filtra companhias com mais de 50.000 voos', () => {
    const sql = ontimeRadarCompanhiasConsulta(ARQUIVO)
    expect(sql).toContain('HAVING COUNT(*) > 50000')
  })

  it('ontimeCancelamentos filtra companhias com mais de 10.000 voos', () => {
    const sql = ontimeCancelamentosConsulta(ARQUIVO)
    expect(sql).toContain('HAVING COUNT(*) > 10000')
  })

  it('ontimeHoraPartida filtra horas entre 0 e 23', () => {
    const sql = ontimeHoraPartidaConsulta(ARQUIVO)
    expect(sql).toContain('HAVING hora BETWEEN 0 AND 23')
  })
})

describe('consultas — parametrização correta do arquivo', () => {
  it('troca o nome do arquivo em todas as ocorrências (consultas com múltiplos FROM)', () => {
    // railwayFaresKpis usa read_parquet(url) 5 vezes
    const sql = railwayFaresKpisConsulta('outro.parquet')
    const ocorrencias = sql.split('\'outro.parquet\'').length - 1
    expect(ocorrencias).toBeGreaterThanOrEqual(3)
  })

  it('estacoesTremTiposPorPais usa o arquivo no FROM e na subquery', () => {
    const sql = estacoesTremTiposPorPaisConsulta('estacoes.parquet')
    const ocorrencias = sql.split('\'estacoes.parquet\'').length - 1
    expect(ocorrencias).toBe(2) // FROM principal + subquery IN
  })
})
