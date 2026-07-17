import { motion } from 'framer-motion'
import { Trash2, Pencil } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function SemesterCard({ semester, index, onDelete, onClick, onEdit }) {
  const gpa = semester.semesterGPA || 0
  const subjectCount = semester.subjects?.length || 0

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.95 }}
      custom={index}
      className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold">{semester.name}</h3>
          <p className="text-zinc-400 text-xs mt-0.5">
            {semester.type} {semester.year}
          </p>
        </div>
        <div className="flex items-center gap-2 px-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(semester)
            }}
            className="text-zinc-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.(semester.id)
            }}
            className="text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* GPA and subject count */}
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-lg font-bold ${gpa >= 3.5 ? 'text-accent' : gpa >= 2.5 ? 'text-primary' : gpa > 0 ? 'text-yellow-400' : 'text-zinc-500'}`}>
          {gpa > 0 ? gpa.toFixed(2) : '—'}
        </span>
        <span className="text-xs text-zinc-500">
          {subjectCount} {subjectCount === 1 ? 'subject' : 'subjects'}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
          {semester.type}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
          {semester.year}
        </span>
      </div>
    </motion.div>
  )
}
