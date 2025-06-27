# Dashboard Empresa Salud

Dashboard interactivo para el análisis de datos de eventos adversos y estadísticas de salud, utilizando datos públicos de la FDA (Food and Drug Administration).

## 🚀 Características

- **Visualizaciones interactivas** con gráficos de barras, líneas, circulares y mapas mundiales
- **Búsqueda en tiempo real** de medicamentos y eventos adversos
- **Análisis demográfico** por grupos de edad y género
- **Distribución geográfica** de eventos reportados
- **Tendencias temporales** con datos históricos
- **Diseño responsive** optimizado para desktop, tablet y móvil

## 🛠 Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos y diseño responsive
- **Recharts** - Gráficos y visualizaciones
- **React Simple Maps** - Mapas interactivos
- **Lucide React** - Iconografía

## 📊 Fuentes de Datos

- **OpenFDA API** - Eventos adversos de medicamentos
- **FDA Drug Enforcement Reports** - Acciones regulatorias

## 🚦 Instalación y Uso

```bash
# Clonar el repositorio
git clone [repository-url]

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
├── components/
│   ├── charts/            # Componentes de visualización
│   ├── dashboard/         # Componentes del dashboard
│   └── layout/            # Navegación y estructura
├── services/              # Integración con APIs
├── hooks/                 # Custom hooks
└── utils/                 # Utilidades
```

## 🔧 Funcionalidades Principales

### Dashboard Principal
- 4 KPIs principales con métricas clave
- Grid de visualizaciones con datos en tiempo real
- Navegación por secciones especializadas

### Búsqueda Inteligente
- Búsqueda por nombres de medicamentos
- Múltiples estrategias de consulta para mejores resultados
- Debouncing para optimizar performance

### Análisis Geográfico
- Mapa mundial interactivo
- Top 10 países por eventos reportados
- Métricas de distribución global

### Análisis Demográfico
- Distribución por grupos de edad (Neonatos a Adultos mayores)
- Análisis por género
- Visualizaciones con porcentajes y tooltips

## ⚡ Optimizaciones

- **Carga progresiva** - Preview rápido seguido de dataset completo
- **Cache inteligente** - 5 minutos de caché para datos
- **Retry logic** - Reintentos automáticos en caso de fallo
- **Filtrado de datos** - Solo muestra información relevante

## 🎨 Diseño

- Paleta de colores profesional orientada al sector salud
- Componentes reutilizables y modulares
- Animaciones y transiciones suaves
- Accesibilidad y UX optimizada

## 📱 Responsive Design

- **Desktop**: Layout completo con grid de 4 columnas
- **Tablet**: Adaptación a 2 columnas
- **Móvil**: Vista de columna única optimizada

## 🔄 Estados de la Aplicación

- **Loading states** con indicadores visuales
- **Error handling** con mensajes informativos
- **Empty states** con sugerencias para el usuario
- **Search states** con feedback en tiempo real

## 🧪 Consideraciones Técnicas

- Manejo de tipos TypeScript estricto
- Componentes funcionales con hooks
- Gestión de estado local optimizada
- Integración con APIs externas robusta

## 📈 Métricas y KPIs

El dashboard muestra métricas clave como:
- Total de eventos adversos registrados
- Porcentaje de eventos serios
- Número de países reportando
- Acciones regulatorias de la FDA

---

**Nota**: Este proyecto utiliza datos públicos de la FDA y está diseñado para fines educativos y de análisis.