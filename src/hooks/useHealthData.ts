'use client'

import { useState, useEffect } from 'react'
import { healthAPI, DrugEvent, DrugEnforcement, HealthStats } from '@/services/healthAPI'

interface UseHealthDataReturn {
  stats: HealthStats | null
  events: DrugEvent[]
  enforcements: DrugEnforcement[]
  loading: boolean
  error: string | null
  refetch: () => void
  searchTerm: string
  setSearchTerm: (term: string) => void
}

let cache: {
  events: DrugEvent[] | null
  enforcements: DrugEnforcement[] | null
  timestamp: number | null
} = {
  events: null,
  enforcements: null,
  timestamp: null
}

const CACHE_DURATION = 5 * 60 * 1000

export function useHealthData(): UseHealthDataReturn {
  const [stats, setStats] = useState<HealthStats | null>(null)
  const [events, setEvents] = useState<DrugEvent[]>([])
  const [enforcements, setEnforcements] = useState<DrugEnforcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const now = Date.now()
      const isCacheValid = cache.timestamp && (now - cache.timestamp) < CACHE_DURATION
      
      if (isCacheValid && cache.events && cache.enforcements) {
        setEvents(cache.events)
        setEnforcements(cache.enforcements)
        const processedStats = healthAPI.processHealthStats(cache.events)
        setStats(processedStats)
        setLoading(false)
        return
      }

      const quickEventsData = await healthAPI.getDrugEvents(300)
      setEvents(quickEventsData)
      const quickStats = healthAPI.processHealthStats(quickEventsData)
      setStats(quickStats)
      
      const enforcementsPromise = healthAPI.getDrugEnforcements(150)
      
      try {
        const [fullEventsData, enforcementsData] = await Promise.all([
          healthAPI.getDrugEvents(1000),
          enforcementsPromise
        ])
        
        if (fullEventsData.length > quickEventsData.length) {
          cache = {
            events: fullEventsData,
            enforcements: enforcementsData,
            timestamp: now
          }
          
          setEvents(fullEventsData)
          setEnforcements(enforcementsData)
          
          const processedStats = healthAPI.processHealthStats(fullEventsData)
          setStats(processedStats)
        } else {
          setEnforcements(enforcementsData)
          cache = {
            events: quickEventsData,
            enforcements: enforcementsData,
            timestamp: now
          }
        }
      } catch (fullDataError) {
        const enforcementsData = await enforcementsPromise
        setEnforcements(enforcementsData)
        cache = {
          events: quickEventsData,
          enforcements: enforcementsData,
          timestamp: now
        }
      }

    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const searchData = async (term: string) => {
    if (!term.trim()) {
      fetchData()
      return
    }

    try {
      setLoading(true)
      setError(null)

      const searchResults = await healthAPI.getSearchResults(term)
      setEvents(searchResults)
      setEnforcements([])
      
      const processedStats = healthAPI.processHealthStats(searchResults)
      setStats(processedStats)

    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Error en la búsqueda')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchData(searchTerm)
      } else {
        fetchData()
      }
    }, 800)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  return {
    stats,
    events,
    enforcements,
    loading,
    error,
    refetch: fetchData,
    searchTerm,
    setSearchTerm
  }
} 