'use client'

import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps'
import { useState, useMemo, useEffect } from 'react'

interface WorldMapProps {
  data: { [country: string]: number }
  title?: string
}

// Using a more reliable TopoJSON source
const geoUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"

export default function WorldMap({ data, title = "World Map" }: WorldMapProps) {
  const [tooltipContent, setTooltipContent] = useState("")
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [mapError, setMapError] = useState<string | null>(null)

  // Create a mapping function to match country names between data and map
  const getCountryValue = (geoCountryName: string): number => {
    // Direct match first
    if (data[geoCountryName]) {
      return data[geoCountryName]
    }
    
    // Map from geographic names (what the map uses) to our data keys
    const geoToDataMapping: { [key: string]: string[] } = {
      'USA': ['US', 'United States'],
      'England': ['GB', 'UK', 'United Kingdom'],
      'Germany': ['DE'],
      'France': ['FR'],
      'Italy': ['IT'],
      'Spain': ['ES'],
      'Canada': ['CA'],
      'Australia': ['AU'],
      'Japan': ['JP'],
      'Brazil': ['BR'],
      'China': ['CN'],
      'India': ['IN'],
      'Russia': ['RU'],
      'South Korea': ['KR'],
      'Korea': ['KR'],
      'Netherlands': ['NL'],
      'Belgium': ['BE'],
      'Switzerland': ['CH'],
      'Austria': ['AT'],
      'Sweden': ['SE'],
      'Norway': ['NO'],
      'Denmark': ['DK'],
      'Finland': ['FI'],
      'Ireland': ['IE'],
      'Portugal': ['PT'],
      'Poland': ['PL'],
      'Mexico': ['MX'],
      'Argentina': ['AR'],
      'Chile': ['CL'],
      'Turkey': ['TR'],
      'Israel': ['IL'],
      'South Africa': ['ZA'],
      'New Zealand': ['NZ'],
      'Thailand': ['TH'],
      'Malaysia': ['MY'],
      'Singapore': ['SG'],
      'Indonesia': ['ID'],
      'Philippines': ['PH'],
      'Vietnam': ['VN']
    }
    
    // Check if this geographic name has alternatives in our data
    const alternatives = geoToDataMapping[geoCountryName]
    if (alternatives) {
      for (const alt of alternatives) {
        if (data[alt]) {
          return data[alt]
        }
      }
    }
    
    return 0
  }

  useEffect(() => {
    // Map data updated
  }, [data])

  // Calculate color intensity based on data values
  const { maxValue, colorScale } = useMemo(() => {
    const values = Object.values(data)
    const max = Math.max(...values, 1)
    
    const getIntensity = (value: number) => {
      if (value === 0) return 0
      return Math.min(value / max, 1)
    }
    
    const getColor = (intensity: number) => {
      if (intensity === 0) return "#f3f4f6" // gray-100
      if (intensity < 0.2) return "#dbeafe" // blue-100
      if (intensity < 0.4) return "#93c5fd" // blue-300
      if (intensity < 0.6) return "#3b82f6" // blue-500
      if (intensity < 0.8) return "#1d4ed8" // blue-700
      return "#1e3a8a" // blue-900
    }
    
    return {
      maxValue: max,
      colorScale: { getIntensity, getColor }
    }
  }, [data])

  const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
    const countryName = geo.properties.NAME || geo.properties.name || geo.properties.NAME_EN
    const value = getCountryValue(countryName)
    
    setTooltipContent(`${countryName}: ${value.toLocaleString()} events`)
    setTooltipPosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseLeave = () => {
    setTooltipContent("")
  }

  return (
    <div className="relative w-full">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        
        {/* Legend */}
        <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
          <span>Low</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <div className="w-4 h-4 bg-blue-100 rounded"></div>
            <div className="w-4 h-4 bg-blue-300 rounded"></div>
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <div className="w-4 h-4 bg-blue-700 rounded"></div>
            <div className="w-4 h-4 bg-blue-900 rounded"></div>
          </div>
          <span>High ({maxValue.toLocaleString()})</span>
        </div>

        {/* Map */}
        <div className="relative">
          {mapError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-700">Error cargando el mapa: {mapError}</p>
            </div>
          ) : (
            <ComposableMap
              projection="geoNaturalEarth1"
              projectionConfig={{
                scale: 130,
                center: [0, 0]
              }}
              width={800}
              height={400}
              className="w-full h-auto"
            >
              <Graticule stroke="#E4E5E7" strokeWidth={0.5} />
              <Geographies 
                geography={geoUrl}
                onError={(error) => {
                  console.error('Map loading error:', error)
                  setMapError('No se pudo cargar el mapa geográfico')
                }}
              >
                {({ geographies }) => {
                  // Geographies loaded
                  
                  return geographies.map((geo) => {
                    const countryName = geo.properties.NAME || geo.properties.name || geo.properties.NAME_EN
                    const value = getCountryValue(countryName)
                    const intensity = colorScale.getIntensity(value)
                    const fillColor = colorScale.getColor(intensity)

                    // Reduced logging
                    // if (value > 0) console.log(`✅ ${countryName}: ${value}`)

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={(event) => handleMouseEnter(geo, event)}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          default: {
                            fill: fillColor,
                            stroke: "#FFFFFF",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                          hover: {
                            fill: intensity > 0 ? "#1e40af" : "#e5e7eb",
                            stroke: "#FFFFFF",
                            strokeWidth: 1,
                            outline: "none",
                          },
                          pressed: {
                            fill: "#1e40af",
                            stroke: "#FFFFFF",
                            strokeWidth: 1,
                            outline: "none",
                          },
                        }}
                        className="cursor-pointer transition-colors duration-200"
                      />
                    )
                  })
                }}
              </Geographies>
            </ComposableMap>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-blue-600">{Object.keys(data).length}</div>
            <div className="text-gray-500">Countries</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-600">{Object.values(data).reduce((a, b) => a + b, 0).toLocaleString()}</div>
            <div className="text-gray-500">Total Events</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-600">{maxValue.toLocaleString()}</div>
            <div className="text-gray-500">Max in Country</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-600">{Math.round(Object.values(data).reduce((a, b) => a + b, 0) / Object.keys(data).length).toLocaleString()}</div>
            <div className="text-gray-500">Average</div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="fixed bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none z-50"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 30,
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  )
} 