import { motion } from 'framer-motion'
import { calculateGPA } from '../../utils/gradeScale'

const CHART_HEIGHT = 220
const CHART_PADDING = { top: 20, right: 30, bottom: 30, left: 40 }
const GPA_MAX = 4.0
const GRID_LINES = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0]

const lineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i) => ({
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, delay: 0.8 + i * 0.12, ease: 'backOut' },
  }),
}

const fillVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, delay: 0.8 },
  },
}

function getPointColor(gpa) {
  if (gpa >= 3.5) return '#10b981'
  if (gpa >= 3.0) return '#3b82f6'
  if (gpa >= 2.5) return '#eab308'
  if (gpa >= 2.0) return '#f97316'
  return '#ef4444'
}

export default function GPABarChart({ semesters }) {
  if (!semesters.length) return null

  const data = semesters.map((s) => ({
    name: s.name,
    type: s.type,
    year: s.year,
    gpa: calculateGPA(s.subjects || []),
  }))

  const plotWidth = 700
  const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom

  const getX = (i) => {
    if (data.length === 1) return plotWidth / 2
    return CHART_PADDING.left + (i / (data.length - 1)) * (plotWidth - CHART_PADDING.left - CHART_PADDING.right)
  }

  const getY = (gpa) => {
    return CHART_PADDING.top + plotHeight - (gpa / GPA_MAX) * plotHeight
  }

  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.gpa), gpa: d.gpa }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  const fillPath = `${linePath} L ${points[points.length - 1].x} ${CHART_PADDING.top + plotHeight} L ${points[0].x} ${CHART_PADDING.top + plotHeight} Z`

  const strokeColor = getPointColor(data[0].gpa)

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <h2 className="text-lg font-semibold text-white mb-5">GPA Progress</h2>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${plotWidth} ${CHART_HEIGHT + 24}`} className="w-full min-w-[400px]" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="33%" stopColor="#3b82f6" />
              <stop offset="66%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines + Y-axis labels */}
          {GRID_LINES.slice().reverse().map((v) => {
            const y = getY(v)
            return (
              <g key={v}>
                <line
                  x1={CHART_PADDING.left}
                  y1={y}
                  x2={plotWidth - CHART_PADDING.right}
                  y2={y}
                  stroke="white"
                  strokeOpacity={v === 0 ? 0.15 : 0.06}
                  strokeDasharray={v === 0 ? 'none' : '4 4'}
                />
                <text x={CHART_PADDING.left - 6} y={y + 3} textAnchor="end" fill="#71717a" fontSize="10">
                  {v.toFixed(1)}
                </text>
              </g>
            )
          })}

          {/* Area fill */}
          <motion.path
            d={fillPath}
            fill="url(#fillGrad)"
            variants={fillVariants}
            initial="hidden"
            animate="visible"
          />

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <motion.g key={i} custom={i} variants={dotVariants} initial="hidden" animate="visible">
              <circle cx={p.x} cy={p.y} r="10" fill={getPointColor(p.gpa)} fillOpacity="0.15" />
              <circle cx={p.x} cy={p.y} r="5" fill="#09090b" stroke={getPointColor(p.gpa)} strokeWidth="2.5" />
              <circle cx={p.x} cy={p.y} r="2.5" fill={getPointColor(p.gpa)} />
            </motion.g>
          ))}

          {/* X-axis labels */}
          {data.map((d, i) => (
            <g key={i}>
              <text x={getX(i)} y={CHART_HEIGHT + 10} textAnchor="middle" fill="#a1a1aa" fontSize="10" fontWeight="500">
                {d.name}
              </text>
              <text x={getX(i)} y={CHART_HEIGHT + 24} textAnchor="middle" fill="#52525b" fontSize="8">
                {d.type} {d.year}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-white/10 text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 3.5+ Excellent</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> 3.0+ Good</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> 2.5+ Average</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Below 2.0</span>
      </div>
    </div>
  )
}
