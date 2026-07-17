import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Plus, ArrowLeft, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import SemesterCard from '../components/semester/SemesterCard'
import useGPA from '../hooks/useGPA'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const SEMESTER_TYPES = ['Fall', 'Spring', 'Summer']

export default function Semesters() {
  const navigate = useNavigate()
  const { semesters, addSemester, updateSemester, deleteSemester } = useGPA()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('Fall')
  const [year, setYear] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editType, setEditType] = useState('Fall')
  const [editYear, setEditYear] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !year.trim()) return
    addSemester({ name: name.trim(), type, year: year.trim() })
    setOpen(false)
    setName('')
    setType('Fall')
    setYear('')
  }

  const handleDelete = (id) => {
    deleteSemester(id)
  }

  const handleEdit = (semester) => {
    setEditingId(semester.id)
    setEditName(semester.name)
    setEditType(semester.type)
    setEditYear(semester.year)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (!editName.trim() || !editYear.trim() || !editingId) return
    updateSemester(editingId, { name: editName.trim(), type: editType, year: editYear.trim() })
    setEditingId(null)
    setEditName('')
    setEditType('Fall')
    setEditYear('')
  }

  return (
    <div className="space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Semesters</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage all your semesters and subjects</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 active:scale-95">
          <Plus className="w-4 h-4" />
          Add Semester
        </button>
      </motion.div>

      {/* Empty state */}
      {semesters.length === 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-white">No semesters yet</h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-sm mx-auto">
            Create your first semester to start adding subjects and calculating your GPA.
          </p>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 active:scale-95">
            <Plus className="w-4 h-4" />
            Add First Semester
          </button>
        </motion.div>
      )}

      {/* Semesters list */}
      {semesters.length > 0 && (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {semesters.map((semester, index) => (
              <SemesterCard
                key={semester.id}
                semester={semester}
                index={index}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onClick={() => navigate(`/dashboard/semesters/${semester.id}`)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add Semester</h2>
                <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="semester-name" className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Semester Name
                  </label>
                  <input
                    id="semester-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Fall 2025"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="semester-type" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Type
                    </label>
                    <select
                      id="semester-type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    >
                      {SEMESTER_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-zinc-900">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="semester-year" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Year
                    </label>
                    <input
                      id="semester-year"
                      type="text"
                      required
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2025"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                    Cancel
                  </button>
                  <Button type="submit" variant="primary" size="md">
                    Create Semester
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingId(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Edit Semester</h2>
                <button onClick={() => setEditingId(null)} className="text-zinc-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div>
                  <label htmlFor="edit-semester-name" className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Semester Name
                  </label>
                  <input
                    id="edit-semester-name"
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Fall 2025"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-semester-type" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Type
                    </label>
                    <select
                      id="edit-semester-type"
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    >
                      {SEMESTER_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-zinc-900">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="edit-semester-year" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Year
                    </label>
                    <input
                      id="edit-semester-year"
                      type="text"
                      required
                      value={editYear}
                      onChange={(e) => setEditYear(e.target.value)}
                      placeholder="2025"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setEditingId(null)} className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                    Cancel
                  </button>
                  <Button type="submit" variant="primary" size="md">
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
