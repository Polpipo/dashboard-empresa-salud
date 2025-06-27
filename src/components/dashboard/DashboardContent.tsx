'use client'

import { useState } from 'react'
import { 
  Activity, 
  AlertTriangle, 
  Users, 
  Globe,
  TrendingUp,
  Shield
} from 'lucide-react'
import { HealthStats, DrugEvent, DrugEnforcement } from '@/services/healthAPI'
import KPICard from './KPICard'
import CustomLineChart from '@/components/charts/LineChart'
import CustomBarChart from '@/components/charts/BarChart'
import CustomPieChart from '@/components/charts/PieChart'
import WorldMap from '@/components/charts/WorldMap'

interface DashboardContentProps {
  activeSection: string
  searchTerm: string
  setSearchTerm: (term: string) => void
  stats: HealthStats | null
  events: DrugEvent[]
  enforcements: DrugEnforcement[]
  loading: boolean
  error: string | null
}

export default function DashboardContent({ 
  activeSection, 
  searchTerm, 
  setSearchTerm, 
  stats, 
  events, 
  enforcements, 
  loading, 
  error 
}: DashboardContentProps) {

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Cargando vista previa...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error al cargar datos</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  // Prepare chart data
  const countryChartData = Object.entries(stats.countryDistribution)
    .map(([name, value]) => ({ name, value }))

  const ageGroupChartData = Object.entries(stats.ageGroups)
    .map(([name, value]) => ({ name, value }))

  const genderChartData = [
    { name: 'Masculino', value: stats.genderDistribution.male },
    { name: 'Femenino', value: stats.genderDistribution.female },
    { name: 'No especificado', value: stats.genderDistribution.unknown }
  ]

  const seriousEventRate = stats.totalEvents > 0 
    ? ((stats.seriousEvents / stats.totalEvents) * 100).toFixed(1)
    : '0'

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total de Eventos"
          value={stats.totalEvents}
          description="Eventos adversos reportados"
          icon={Activity}
          color="blue"
        />
        <KPICard
          title="Eventos Serios"
          value={stats.seriousEvents}
          description={`${seriousEventRate}% del total`}
          icon={AlertTriangle}
          color="red"
        />
        <KPICard
          title="Países Reportando"
          value={Object.keys(stats.countryDistribution).length}
          description="Distribución geográfica"
          icon={Globe}
          color="green"
        />
        <KPICard
          title="Acciones Regulatorias"
          value={enforcements.length}
          description="Medidas de cumplimiento FDA"
          icon={Shield}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomLineChart
          data={stats.monthlyTrend}
          title="Tendencia Mensual de Eventos"
          color="#3b82f6"
        />
        <CustomBarChart
          data={countryChartData}
          title="Eventos por País (Top 10)"
          color="#22c55e"
        />
        <CustomPieChart
          data={ageGroupChartData}
          title="Distribución por Grupo de Edad"
        />
        <CustomPieChart
          data={genderChartData}
          title="Distribución por Género"
          colors={['#3b82f6', '#ec4899', '#6b7280']}
        />
      </div>
    </div>
  )

  const renderTrends = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <CustomLineChart
          data={stats.monthlyTrend}
          title="Análisis Temporal Detallado"
          color="#8b5cf6"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Tendencia Promedio"
          value={stats.monthlyTrend.length > 0 
            ? Math.round(stats.monthlyTrend.reduce((sum, item) => sum + item.events, 0) / stats.monthlyTrend.length)
            : 0}
          description="Eventos por mes"
          icon={TrendingUp}
          color="purple"
        />
        <KPICard
          title="Pico Máximo"
          value={stats.monthlyTrend.length > 0 
            ? Math.max(...stats.monthlyTrend.map(item => item.events))
            : 0}
          description="Mayor registro mensual"
          icon={TrendingUp}
          color="red"
        />
        <KPICard
          title="Período Analizado"
          value={stats.monthlyTrend.length}
          description="Meses con datos"
          icon={Activity}
          color="blue"
        />
      </div>
    </div>
  )

  const renderDemographics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomPieChart
          data={ageGroupChartData}
          title="Distribución por Grupo de Edad"
        />
        <CustomPieChart
          data={genderChartData}
          title="Distribución por Género"
          colors={['#3b82f6', '#ec4899', '#6b7280']}
        />
      </div>
    </div>
  )

  const renderGeographic = () => (
    <div className="space-y-6">
      {/* World Map */}
      <WorldMap
        data={stats.countryDistribution}
        title="Mapa Mundial de Eventos Adversos"
      />
      
      {/* Bar Chart */}
      <CustomBarChart
        data={countryChartData.slice(0, 10)}
        title="Top 10 Países por Eventos"
        color="#06b6d4"
      />
      
      {/* Geographic KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Países con Reportes"
          value={Object.keys(stats.countryDistribution).length}
          description="Cobertura global"
          icon={Globe}
          color="green"
        />
        <KPICard
          title="País Principal"
          value={countryChartData.length > 0 ? countryChartData[0].name : 'N/A'}
          description="Mayor número de reportes"
          icon={TrendingUp}
          color="blue"
        />
        <KPICard
          title="Total de Eventos"
          value={Object.values(stats.countryDistribution).reduce((a, b) => a + b, 0)}
          description="Suma global"
          icon={Activity}
          color="purple"
        />
        <KPICard
          title="Promedio por País"
          value={Math.round(Object.values(stats.countryDistribution).reduce((a, b) => a + b, 0) / Object.keys(stats.countryDistribution).length)}
          description="Eventos promedio"
          icon={Users}
          color="yellow"
        />
      </div>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'trends':
        return renderTrends()
      case 'demographics':
        return renderDemographics()
      case 'geographic':
        return renderGeographic()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="p-6">

      
      {/* Search Results Header */}
      {searchTerm && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">🔍</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Resultados de búsqueda para: "{searchTerm}"
              </h3>
              <p className="text-sm text-blue-600">
                Mostrando {events.length} eventos adversos relacionados con {searchTerm}
                {events.length === 0 && " - Intenta con términos como 'aspirin', 'insulin', 'acetaminophen'"}
              </p>
            </div>
            <button
              onClick={() => setSearchTerm('')}
              className="ml-4 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Limpiar búsqueda
            </button>
          </div>
        </div>
      )}
      
      {renderSection()}
    </div>
  )
}