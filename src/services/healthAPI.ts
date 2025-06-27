const FDA_BASE_URL = 'https://api.fda.gov'

export interface DrugEvent {
  receivedate: string
  serious: string
  occurcountry: string
  patient: {
    patientagegroup?: string
    patientsex?: string
  }
  primarysource: {
    reportercountry?: string
  }
}

export interface DrugEnforcement {
  recall_initiation_date: string
  status: string
  state: string
  city: string
  reason_for_recall: string
  classification: string
  product_description: string
}

export interface HealthStats {
  totalEvents: number
  seriousEvents: number
  countryDistribution: { [key: string]: number }
  monthlyTrend: { month: string; events: number }[]
  ageGroups: { [key: string]: number }
  genderDistribution: { male: number; female: number; unknown: number }
}

class HealthAPIService {
  private normalizeAgeGroup(ageCode: string): string {
    const ageGroupMapping: { [key: string]: string } = {
      '1': 'Neonatos (0-27 días)',
      '2': 'Infantes (28 días - 23 meses)',
      '3': 'Niños (2-11 años)',
      '4': 'Adolescentes (12-16 años)',
      '5': 'Adultos (17-64 años)',
      '6': 'Adultos mayores (65+ años)',
      'Unknown': 'No especificado'
    }
    
    return ageGroupMapping[ageCode] || `Código ${ageCode}`
  }

  private normalizeCountryName(countryCode: string): string {
    const countryMapping: { [key: string]: string } = {
      'US': 'United States',
      'CA': 'Canada',
      'GB': 'United Kingdom',
      'DE': 'Germany',
      'FR': 'France',
      'IT': 'Italy',
      'ES': 'Spain',
      'AU': 'Australia',
      'JP': 'Japan',
      'BR': 'Brazil',
      'MX': 'Mexico',
      'IN': 'India',
      'CN': 'China',
      'KR': 'South Korea',
      'NL': 'Netherlands',
      'BE': 'Belgium',
      'CH': 'Switzerland',
      'AT': 'Austria',
      'SE': 'Sweden',
      'NO': 'Norway',
      'DK': 'Denmark',
      'FI': 'Finland',
      'IE': 'Ireland',
      'PT': 'Portugal',
      'GR': 'Greece',
      'PL': 'Poland',
      'CZ': 'Czech Republic',
      'HU': 'Hungary',
      'RO': 'Romania',
      'BG': 'Bulgaria',
      'HR': 'Croatia',
      'SI': 'Slovenia',
      'SK': 'Slovakia',
      'LT': 'Lithuania',
      'LV': 'Latvia',
      'EE': 'Estonia',
      'IL': 'Israel',
      'TR': 'Turkey',
      'RU': 'Russia',
      'UA': 'Ukraine',
      'ZA': 'South Africa',
      'EG': 'Egypt',
      'MA': 'Morocco',
      'NG': 'Nigeria',
      'KE': 'Kenya',
      'AR': 'Argentina',
      'CL': 'Chile',
      'CO': 'Colombia',
      'PE': 'Peru',
      'VE': 'Venezuela',
      'TH': 'Thailand',
      'MY': 'Malaysia',
      'SG': 'Singapore',
      'ID': 'Indonesia',
      'PH': 'Philippines',
      'VN': 'Vietnam',
      'NZ': 'New Zealand'
    }
    
    return countryMapping[countryCode] || countryCode || 'Unknown'
  }

  private async fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return await response.json()
      } catch (error) {
        if (i === retries - 1) throw error
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }

  async getDrugEvents(limit = 1000): Promise<DrugEvent[]> {
    const url = `${FDA_BASE_URL}/drug/event.json?limit=${limit}`
    try {
      const data = await this.fetchWithRetry(url)
      return data.results || []
    } catch (error) {
      console.error('Error loading health events:', error)
      return []
    }
  }

  async getDrugEnforcements(limit = 50): Promise<DrugEnforcement[]> {
    const url = `${FDA_BASE_URL}/drug/enforcement.json?limit=${limit}`
    const data = await this.fetchWithRetry(url)
    return data.results || []
  }

  async getSearchResults(term: string, limit = 200): Promise<DrugEvent[]> {
    if (!term.trim()) return []
    
    const searchStrategies = [
      `patient.drug.medicinalproduct:${term.toLowerCase()}`,
      `patient.drug.medicinalproduct:${term.toLowerCase()}*`,
      `patient.drug.drugindication:${term.toLowerCase()}`,
      `patient.drug.medicinalproduct:"${term.toLowerCase()}"`
    ]
    
    for (let i = 0; i < searchStrategies.length; i++) {
      const searchQuery = searchStrategies[i]
      try {
        const url = `${FDA_BASE_URL}/drug/event.json?search=${searchQuery}&limit=${limit}`
        const data = await this.fetchWithRetry(url)
        
        if (data.results && data.results.length > 0) {
          return data.results
        }
      } catch (error) {
        continue
      }
    }
    
    return []
  }

  processHealthStats(events: DrugEvent[]): HealthStats {
    const stats: HealthStats = {
      totalEvents: events.length,
      seriousEvents: 0,
      countryDistribution: {},
      monthlyTrend: [],
      ageGroups: {},
      genderDistribution: { male: 0, female: 0, unknown: 0 }
    }

    const monthlyData: { [key: string]: number } = {}

    events.forEach((event) => {
      if (event.serious === '1') {
        stats.seriousEvents++
      }

      const rawCountry = event.occurcountry || event.primarysource?.reportercountry || 'Unknown'
      const country = this.normalizeCountryName(rawCountry)
      stats.countryDistribution[country] = (stats.countryDistribution[country] || 0) + 1

      if (event.receivedate) {
        let parsedDate: Date
        if (event.receivedate.length === 8) {
          const year = parseInt(event.receivedate.substring(0, 4))
          const month = parseInt(event.receivedate.substring(4, 6)) - 1
          const day = parseInt(event.receivedate.substring(6, 8))
          parsedDate = new Date(year, month, day)
        } else {
          parsedDate = new Date(event.receivedate)
        }
        
        if (!isNaN(parsedDate.getTime())) {
          const monthKey = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`
          monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
        }
      }

      const rawAgeGroup = event.patient?.patientagegroup || 'Unknown'
      const ageGroup = this.normalizeAgeGroup(rawAgeGroup)
      stats.ageGroups[ageGroup] = (stats.ageGroups[ageGroup] || 0) + 1

      const gender = event.patient?.patientsex
      if (gender === '1') {
        stats.genderDistribution.male++
      } else if (gender === '2') {
        stats.genderDistribution.female++
      } else {
        stats.genderDistribution.unknown++
      }
    })

    if (Object.keys(monthlyData).length > 0) {
      const sortedMonths = Object.keys(monthlyData).sort()
      stats.monthlyTrend = sortedMonths.map(month => ({
        month,
        events: monthlyData[month]
      }))
      
      if (stats.monthlyTrend.length > 12) {
        stats.monthlyTrend = stats.monthlyTrend.slice(-12)
      }
    } else {
      const last6Months = []
      const now = new Date()
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        last6Months.push({
          month: monthKey,
          events: 0
        })
      }
      stats.monthlyTrend = last6Months
    }

    return stats
  }
}

export const healthAPI = new HealthAPIService() 