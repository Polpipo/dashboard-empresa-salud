'use client'

import { Search, Bell, RefreshCw, HelpCircle } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onRefresh: () => void
  loading: boolean
}

export default function Navbar({ searchTerm, onSearchChange, onRefresh, loading }: NavbarProps) {
  const [showSearchHelp, setShowSearchHelp] = useState(false)
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Dashboard Salud
          </h1>
          <div className="hidden md:block w-px h-6 bg-gray-300" />
          <p className="hidden md:block text-sm text-gray-500">
            Análisis de datos FDA en tiempo real
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Bar with Help */}
          <div className="relative">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`h-4 w-4 ${loading && searchTerm ? 'text-primary-600' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Buscar medicamento (ej: aspirin, insulin)..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
                {loading && searchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
                  </div>
                )}
              </div>
              
              {/* Help Button */}
              <button
                onClick={() => setShowSearchHelp(!showSearchHelp)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                title="¿Qué puedo buscar?"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
            
            {/* Help Dropdown */}
            {showSearchHelp && (
              <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                <h4 className="font-semibold text-gray-900 mb-2">¿Qué puedes buscar?</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <strong>Medicamentos:</strong>
                    <div className="ml-2">aspirin, insulin, acetaminophen, ibuprofen, metformin</div>
                  </div>
                  <div>
                    <strong>Condiciones:</strong>
                    <div className="ml-2">diabetes, hypertension, depression, pain</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    El buscador muestra eventos adversos reportados a la FDA para el término buscado.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-primary-600' : ''}`} />
            <span className="ml-2 hidden md:block">
              {loading ? 'Actualizando...' : 'Actualizar'}
            </span>
          </button>

          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-500 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  )
} 