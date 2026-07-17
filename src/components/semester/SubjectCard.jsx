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

export default function SubjectCard({ subject, index, onDelete, onEdit }) {
  const qualityPoints = (subject.gradePoint || 0) * (subject.credits || 0)

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      custom={index}
      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
    >
      <div className="flex-1">
        <h3 className="text-white font-medium">{subject.name}</h3>
        <p className="text-zinc-400 text-xs mt-0.5">
          {subject.credits} credit hours
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className="text-sm font-semibold text-white bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
            {subject.grade}
          </span>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            {qualityPoints.toFixed(2)} pts
          </p>
        </div>
        <button
          onClick={() => onEdit?.(subject)}
          className="text-zinc-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete?.(subject.id)}
          className="text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
