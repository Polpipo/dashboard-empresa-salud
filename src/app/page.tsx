'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import DashboardContent from '@/components/dashboard/DashboardContent'
import { useHealthData } from '@/hooks/useHealthData'

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('overview')
  const { searchTerm, setSearchTerm, refetch, loading, stats, events, enforcements, error } = useHealthData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={refetch}
        loading={loading}
      />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <DashboardContent 
            activeSection={activeSection}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            stats={stats}
            events={events}
            enforcements={enforcements}
            loading={loading}
            error={error}
          />
        </main>
      </div>
    </div>
  )
} 