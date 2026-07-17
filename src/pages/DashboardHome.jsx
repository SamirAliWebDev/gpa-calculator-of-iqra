import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, TrendingUp, GraduationCap, Plus, ArrowRight } from 'lucide-react'
import useGPA from '../hooks/useGPA'
import GPABarChart from '../components/semester/GPABarChart'
import { useAuth } from '../context/AuthContext'
import db from '../lib/db'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function DashboardHome() {
  const { user } = useAuth()
  const { data } = db.useQuery(
    user ? { profiles: {} } : null
  )
  const profile = data?.profiles?.[0]
  const userName = profile?.name || 'Student'

  const { semesters, getOverallGPA, getGPAColor } = useGPA()
  const totalSubjects = semesters.reduce((sum, s) => sum + (s.subjects?.length || 0), 0)
  const overallGPA = getOverallGPA()

  const stats = [
    { label: 'Total Semesters', value: String(semesters.length), icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Overall GPA', value: overallGPA > 0 ? overallGPA.toFixed(2) : '—', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Total Subjects', value: String(totalSubjects), icon: GraduationCap, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ]

  return (
    <div className="space-y-8">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Welcome back, <span className="text-primary">{userName}</span>
        </h1>
        <p className="text-zinc-400 mt-2">Track your academic progress across semesters.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={i + 1}
            whileHover={{ y: -4 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 cursor-default"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </span>
            </div>
            <p className={`text-3xl font-bold ${getGPAColor(overallGPA)}`}>{stat.value}</p>
            <p className="text-sm text-zinc-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {semesters.length > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <GPABarChart semesters={semesters} />
        </motion.div>
      )}

      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/dashboard/semesters"
            className="group flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
          >
            <div className="p-3 rounded-xl bg-primary/10">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Add Semester</p>
              <p className="text-xs text-zinc-400 mt-0.5">Create a new semester to start tracking</p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/dashboard/semesters"
            className="group flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-accent/30 transition-all duration-300"
          >
            <div className="p-3 rounded-xl bg-accent/10">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">View All Semesters</p>
              <p className="text-xs text-zinc-400 mt-0.5">See your complete academic history</p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </motion.div>

      {semesters.length === 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-white">No semesters yet</h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-sm mx-auto">
            Start by adding your first semester to begin tracking your GPA.
          </p>
          <Link
            to="/dashboard/semesters"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add First Semester
          </Link>
        </motion.div>
      )}
    </div>
  )
}
