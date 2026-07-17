import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, X, BookOpen } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import SubjectCard from '../components/semester/SubjectCard'
import { GRADE_OPTIONS } from '../utils/gradeScale'
import { getQualityPoint } from '../utils/gradeScale'
import useGPA from '../hooks/useGPA'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function SemesterDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getSemester, addSubject, deleteSubject, updateSubject, getSemesterGPA, getGPAColor, getGPALabel } = useGPA()
  const [open, setOpen] = useState(false)
  const [subjectName, setSubjectName] = useState('')
  const [credits, setCredits] = useState('')
  const [grade, setGrade] = useState(GRADE_OPTIONS[0])
  const [editingSubject, setEditingSubject] = useState(null)
  const [editName, setEditName] = useState('')
  const [editCredits, setEditCredits] = useState('')
  const [editGrade, setEditGrade] = useState(GRADE_OPTIONS[0])

  const semester = getSemester(id)
  const subjects = semester?.subjects || []
  const gpa = getSemesterGPA(id)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!subjectName.trim() || !credits.trim()) return
    const creditsNum = parseFloat(credits) || 0
    addSubject(id, {
      name: subjectName.trim(),
      credits: creditsNum,
      grade,
      gradePoint: getQualityPoint(grade, creditsNum),
    })
    setOpen(false)
    setSubjectName('')
    setCredits('')
    setGrade(GRADE_OPTIONS[0])
  }

  const handleDelete = (subjectId) => {
    deleteSubject(id, subjectId)
  }

  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setEditName(subject.name)
    setEditCredits(String(subject.credits))
    setEditGrade(subject.grade)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (!editName.trim() || !editCredits.trim() || !editingSubject) return
    const creditsNum = parseFloat(editCredits) || 0
    updateSubject(id, editingSubject.id, {
      name: editName.trim(),
      credits: creditsNum,
      grade: editGrade,
      gradePoint: getQualityPoint(editGrade, creditsNum),
    })
    setEditingSubject(null)
    setEditName('')
    setEditCredits('')
    setEditGrade(GRADE_OPTIONS[0])
  }

  return (
    <div className="space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <button onClick={() => navigate('/dashboard/semesters')} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Semesters
        </button>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{semester?.name || 'Semester'}</h1>
          <p className="text-zinc-400 text-sm mt-1">{semester?.type} {semester?.year} — Add subjects and track your performance</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 active:scale-95">
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </motion.div>

      {/* GPA Card */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400 mb-1">Semester GPA</p>
            <p className={`text-4xl font-bold ${getGPAColor(gpa)}`}>
              {subjects.length > 0 ? gpa.toFixed(2) : '—'}
            </p>
            {subjects.length > 0 && (
              <p className="text-xs text-zinc-500 mt-1">{getGPALabel(gpa)}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400">Total Subjects</p>
            <p className="text-2xl font-bold text-white">{subjects.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Empty state */}
      {subjects.length === 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-white">No subjects yet</h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-sm mx-auto">
            Add your first subject to calculate your semester GPA.
          </p>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 active:scale-95">
            <Plus className="w-4 h-4" />
            Add First Subject
          </button>
        </motion.div>
      )}

      {/* Subjects list */}
      {subjects.length > 0 && (
        <motion.div layout className="space-y-3">
          <AnimatePresence>
            {subjects.map((subject, index) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                index={index}
                onDelete={handleDelete}
                onEdit={handleEdit}
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
                <h2 className="text-xl font-bold text-white">Add Subject</h2>
                <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="subject-name" className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Subject Name
                  </label>
                  <input
                    id="subject-name"
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="e.g. Calculus I"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="credits" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Credit Hours
                    </label>
                    <input
                      id="credits"
                      type="number"
                      min="0"
                      step="0.5"
                      required
                      value={credits}
                      onChange={(e) => setCredits(e.target.value)}
                      placeholder="3"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Grade
                    </label>
                    <select
                      id="grade"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    >
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g} value={g} className="bg-zinc-900">
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                    Cancel
                  </button>
                  <Button type="submit" variant="primary" size="md">
                    Add Subject
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingSubject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingSubject(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Edit Subject</h2>
                <button onClick={() => setEditingSubject(null)} className="text-zinc-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div>
                  <label htmlFor="edit-subject-name" className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Subject Name
                  </label>
                  <input
                    id="edit-subject-name"
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Calculus I"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-credits" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Credit Hours
                    </label>
                    <input
                      id="edit-credits"
                      type="number"
                      min="0"
                      step="0.5"
                      required
                      value={editCredits}
                      onChange={(e) => setEditCredits(e.target.value)}
                      placeholder="3"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-grade" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Grade
                    </label>
                    <select
                      id="edit-grade"
                      value={editGrade}
                      onChange={(e) => setEditGrade(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    >
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g} value={g} className="bg-zinc-900">
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setEditingSubject(null)} className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
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
