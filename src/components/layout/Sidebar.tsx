'use client'

import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Activity,
  Shield,
  Globe,
  FileText
} from 'lucide-react'

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const navigationItems = [
  {
    id: 'overview',
    name: 'Resumen General',
    icon: BarChart3,
    description: 'Vista general del dashboard'
  },
  {
    id: 'trends',
    name: 'Tendencias',
    icon: TrendingUp,
    description: 'Análisis temporal'
  },
  {
    id: 'demographics',
    name: 'Demografía',
    icon: Users,
    description: 'Distribución por edad y género'
  },
  {
    id: 'safety',
    name: 'Seguridad',
    icon: Shield,
    description: 'Eventos adversos serios'
  },
  {
    id: 'geographic',
    name: 'Geográfico',
    icon: Globe,
    description: 'Distribución por países'
  },
  {
    id: 'enforcement',
    name: 'Regulaciones',
    icon: AlertTriangle,
    description: 'Acciones regulatorias'
  }
]

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="h-8 w-8 text-primary-600" />
          <div>
            <h2 className="font-bold text-gray-900">HealthCorp</h2>
            <p className="text-xs text-gray-500">Analytics Dashboard</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            )
          })}
        </nav>

        <div className="mt-8 p-3 bg-health-50 rounded-lg">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-health-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-health-800">
                Fuente de Datos
              </p>
              <p className="text-xs text-health-600">
                FDA OpenData API
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 